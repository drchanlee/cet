import { useState, useRef, useCallback, useEffect } from 'react';

const FADE_TIME = 0.01; // 10ms fade to prevent clicks

export const useAudioEngine = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const dryGainRef = useRef<GainNode | null>(null);
    const wetGainRef = useRef<GainNode | null>(null);
    const compressorNodeRef = useRef<DynamicsCompressorNode | null>(null);
    const makeupGainRef = useRef<GainNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('טוען...');
    const [activeSource, setActiveSource] = useState<'A' | 'B'>('A');

    const createAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = context;
        }
    }, []);

    const getReductionValue = useCallback(() => {
        if (compressorNodeRef.current) {
            return compressorNodeRef.current.reduction;
        }
        return 0;
    }, []);

    const loadAudio = useCallback(async (url: string) => {
        setIsLoading(true);
        setLoadingMessage('טוען סמפל...');
        createAudioContext();
        const context = audioContextRef.current!;
        
        try {
            const response = await fetch(url, { mode: 'cors' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for URL ${url}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const decodedData = await context.decodeAudioData(arrayBuffer);
            audioBufferRef.current = decodedData;
        } catch (error) {
            console.error("Error loading audio file:", error);
            audioBufferRef.current = null;
        } finally {
            setIsLoading(false);
        }
    }, [createAudioContext]);

    const getBufferRms = (buffer: AudioBuffer): number => {
        const numChannels = buffer.numberOfChannels;
        let sum = 0;
        for (let i = 0; i < numChannels; i++) {
            const channelData = buffer.getChannelData(i);
            let channelSum = 0;
            for (let j = 0; j < channelData.length; j++) {
                channelSum += channelData[j] * channelData[j];
            }
            sum += channelSum / channelData.length;
        }
        return Math.sqrt(sum / numChannels);
    };

    const setupAudioGraph = useCallback(async (params: any) => {
        const context = audioContextRef.current;
        if (!context || !audioBufferRef.current) return;

        setIsLoading(true);
        setLoadingMessage('מכייל עוצמה...');

        try {
            // --- Volume Matching Calculation ---
            const originalBuffer = audioBufferRef.current;
            const rmsDry = getBufferRms(originalBuffer);

            const offlineContext = new OfflineAudioContext(
                originalBuffer.numberOfChannels,
                originalBuffer.length,
                originalBuffer.sampleRate
            );

            const offlineSource = offlineContext.createBufferSource();
            offlineSource.buffer = originalBuffer;

            const offlineCompressor = offlineContext.createDynamicsCompressor();
            offlineCompressor.threshold.setValueAtTime(params.threshold ?? -24, 0);
            offlineCompressor.knee.setValueAtTime(params.knee_db ?? 6, 0);
            offlineCompressor.ratio.setValueAtTime(params.ratio ?? 4, 0);
            offlineCompressor.attack.setValueAtTime((params.attack_ms ?? 10) / 1000, 0);
            offlineCompressor.release.setValueAtTime((params.release_ms ?? 250) / 1000, 0);
            
            offlineSource.connect(offlineCompressor);
            offlineCompressor.connect(offlineContext.destination);
            offlineSource.start(0);

            const compressedBuffer = await offlineContext.startRendering();
            const rmsWet = getBufferRms(compressedBuffer);

            const makeupGainValue = rmsWet > 0.0001 ? rmsDry / rmsWet : 1;

            // --- Setup Real-time Audio Graph ---
            sourceNodeRef.current?.disconnect();
            dryGainRef.current?.disconnect();
            wetGainRef.current?.disconnect();
            compressorNodeRef.current?.disconnect();
            makeupGainRef.current?.disconnect();

            // Path A (Dry)
            dryGainRef.current = context.createGain();
            dryGainRef.current.connect(context.destination);

            // Path B (Wet)
            compressorNodeRef.current = context.createDynamicsCompressor();
            compressorNodeRef.current.threshold.setValueAtTime(params.threshold ?? -24, context.currentTime);
            compressorNodeRef.current.knee.setValueAtTime(params.knee_db ?? 6, context.currentTime);
            compressorNodeRef.current.ratio.setValueAtTime(params.ratio ?? 4, context.currentTime);
            compressorNodeRef.current.attack.setValueAtTime((params.attack_ms ?? 10) / 1000, context.currentTime);
            compressorNodeRef.current.release.setValueAtTime((params.release_ms ?? 250) / 1000, context.currentTime);

            makeupGainRef.current = context.createGain();
            makeupGainRef.current.gain.setValueAtTime(makeupGainValue, context.currentTime);

            wetGainRef.current = context.createGain();
            
            compressorNodeRef.current
                .connect(makeupGainRef.current)
                .connect(wetGainRef.current)
                .connect(context.destination);

            dryGainRef.current.gain.value = 0;
            wetGainRef.current.gain.value = 0;

        } catch (error) {
            console.error("Failed to setup audio graph with volume matching:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const updateCompressorParams = useCallback((params: any) => {
        const context = audioContextRef.current;
        const compressor = compressorNodeRef.current;
        if (!context || !compressor) return;
    
        const now = context.currentTime;
        compressor.threshold.setValueAtTime(params.threshold ?? -24, now);
        compressor.knee.setValueAtTime(params.knee_db ?? 6, now);
        compressor.ratio.setValueAtTime(params.ratio ?? 4, now);
        compressor.attack.setValueAtTime((params.attack_ms ?? 10) / 1000, now);
        compressor.release.setValueAtTime((params.release_ms ?? 250) / 1000, now);
    }, []);

    const play = useCallback(() => {
        const context = audioContextRef.current;
        if (!context || !audioBufferRef.current) return;
        
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
        }

        const source = context.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.loop = isLooping;

        if(dryGainRef.current) source.connect(dryGainRef.current);
        if(compressorNodeRef.current) source.connect(compressorNodeRef.current);
        
        source.start(0);
        sourceNodeRef.current = source;
        setIsPlaying(true);
    }, [isLooping]);

    const stop = useCallback(() => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
            } catch (e) {
                // Ignore errors if the node is already stopped.
            }
            sourceNodeRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const togglePlayPause = useCallback(async () => {
        if (!audioContextRef.current) {
            createAudioContext();
        }
        const context = audioContextRef.current;
        
        if (context && context.state === 'suspended') {
            await context.resume();
        }

        if (isPlaying) {
            stop();
        } else {
            play();
        }
    }, [isPlaying, stop, play, createAudioContext]);
    
    const setSource = useCallback((source: 'A' | 'B') => {
        const context = audioContextRef.current;
        if (!context || !dryGainRef.current || !wetGainRef.current) return;

        setActiveSource(source);
        const now = context.currentTime;

        if (source === 'A') {
            dryGainRef.current.gain.cancelScheduledValues(now);
            wetGainRef.current.gain.cancelScheduledValues(now);
            dryGainRef.current.gain.linearRampToValueAtTime(1, now + FADE_TIME);
            wetGainRef.current.gain.linearRampToValueAtTime(0, now + FADE_TIME);
        } else {
            dryGainRef.current.gain.cancelScheduledValues(now);
            wetGainRef.current.gain.cancelScheduledValues(now);
            dryGainRef.current.gain.linearRampToValueAtTime(0, now + FADE_TIME);
            wetGainRef.current.gain.linearRampToValueAtTime(1, now + FADE_TIME);
        }
    }, []);

    useEffect(() => {
        return () => { 
            audioContextRef.current?.close().catch(e => console.error(e));
        }
    }, []);

    return {
        loadAudio,
        setupAudioGraph,
        updateCompressorParams,
        togglePlayPause,
        stop,
        setSource,
        toggleLoop: () => setIsLooping(prev => !prev),
        getReductionValue,
        isPlaying,
        isLooping,
        isLoading,
        loadingMessage,
        activeSource,
        audioContextReady: !!audioContextRef.current,
    };
};
