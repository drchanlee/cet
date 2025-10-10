export const LEVELS_DATA = {
  "compressor_presence": [
    { level: 1, ratio: 10,  attack_ms: 0.3, release_ms: 800, gr_db: [8,12],   knee_db: 0, description: "הכי בולט, 'פאמפ' אפשרי" },
    { level: 2, ratio: 8,   attack_ms: 1,   release_ms: 600, gr_db: [6,10],   knee_db: 3, description: "עדיין אגרסיבי" },
    { level: 3, ratio: 6,   attack_ms: 5,   release_ms: 400, gr_db: [5,8],    knee_db: 3, description: "מעט עדין יותר" },
    { level: 4, ratio: 4,   attack_ms: 10,  release_ms: 300, gr_db: [4,6],    knee_db: 6, description: "מתחיל להיות טריקי" },
    { level: 5, ratio: 3,   attack_ms: 15,  release_ms: 250, gr_db: [3,5],    knee_db: 6, description: "עדין למדי" },
    { level: 6, ratio: 2.5, attack_ms: 20,  release_ms: 200, gr_db: [2,4],    knee_db: 6, description: "קשה לזיהוי" },
    { level: 7, ratio: 2,   attack_ms: 30,  release_ms: 150, gr_db: [1.5,3],  knee_db: 6, description: "שקוף מאוד" },
    { level: 8, ratio: 1.5, attack_ms: 40,  release_ms: 120, gr_db: [1,2],    knee_db: 6, description: "כמעט בלתי נשמע" }
  ],
  "attack": [
    { level: 1, fast_ms: [0.1,0.3], slow_ms: [30,40], ratio: 4, release_ms: 250, gr_db:[4,8], description: "הבדל קיצוני" },
    { level: 2, fast_ms: [0.3,0.5], slow_ms: [25,35], ratio: 4, release_ms: 250, gr_db:[4,7], description: "הבדל גדול מאוד" },
    { level: 3, fast_ms: [0.5,1],   slow_ms: [20,30], ratio: 4, release_ms: 250, gr_db:[3,6], description: "הבדל ברור" },
    { level: 4, fast_ms: [1,3],     slow_ms: [18,25], ratio: 4, release_ms: 250, gr_db:[3,5], description: "הבדל מורגש" },
    { level: 5, fast_ms: [3,5],     slow_ms: [15,22], ratio: 4, release_ms: 250, gr_db:[2,4], description: "הבדל עדין" },
    { level: 6, fast_ms: [4,6],     slow_ms: [12,18], ratio: 4, release_ms: 250, gr_db:[2,3.5], description: "הבדל דק" },
    { level: 7, fast_ms: [5,7],     slow_ms: [10,15], ratio: 4, release_ms: 250, gr_db:[1.5,3], description: "הבדל קטן מאוד" },
    { level: 8, fast_ms: [5,6],     slow_ms: [12,14], ratio: 4, release_ms: 250, gr_db:[1,2.5], description: "הבדלים מינוריים" }
  ],
  "release": [
    { level: 1, fast_ms: [50,80],   slow_ms: [800,1000], ratio: 4, attack_ms: 10, gr_db:[5,8], description: "Pumping מורגש" },
    { level: 2, fast_ms: [80,120],  slow_ms: [600,900],  ratio: 4, attack_ms: 10, gr_db:[4,7], description: "הבדל קיצוני" },
    { level: 3, fast_ms: [100,150], slow_ms: [500,800],  ratio: 4, attack_ms: 10, gr_db:[4,6], description: "הבדל ברור" },
    { level: 4, fast_ms: [120,180], slow_ms: [400,700],  ratio: 4, attack_ms: 10, gr_db:[3,5], description: "הבדל מורגש" },
    { level: 5, fast_ms: [150,220], slow_ms: [350,600],  ratio: 4, attack_ms: 10, gr_db:[3,4], description: "הבדל עדין" },
    { level: 6, fast_ms: [180,260], slow_ms: [300,500],  ratio: 4, attack_ms: 10, gr_db:[2,3.5], description: "הבדל דק" },
    { level: 7, fast_ms: [200,280], slow_ms: [260,420],  ratio: 4, attack_ms: 10, gr_db:[2,3], description: "מתחיל להיות עדין" },
    { level: 8, fast_ms: [220,300], slow_ms: [300,380],  ratio: 4, attack_ms: 10, gr_db:[1.5,2.5], description: "מאוד קרוב" }
  ],
  "abx_test": [
    { level: 1, ratio: 10,  attack_ms: 0.3, release_ms: 800, gr_db: [8,12],   knee_db: 0, description: "הכי בולט, 'פאמפ' אפשרי" },
    { level: 2, ratio: 8,   attack_ms: 1,   release_ms: 600, gr_db: [6,10],   knee_db: 3, description: "עדיין אגרסיבי" },
    { level: 3, ratio: 6,   attack_ms: 5,   release_ms: 400, gr_db: [5,8],    knee_db: 3, description: "מעט עדין יותר" },
    { level: 4, ratio: 4,   attack_ms: 10,  release_ms: 300, gr_db: [4,6],    knee_db: 6, description: "מתחיל להיות טריקי" },
    { level: 5, ratio: 3,   attack_ms: 15,  release_ms: 250, gr_db: [3,5],    knee_db: 6, description: "עדין למדי" },
    { level: 6, ratio: 2.5, attack_ms: 20,  release_ms: 200, gr_db: [2,4],    knee_db: 6, description: "קשה לזיהוי" },
    { level: 7, ratio: 2,   attack_ms: 30,  release_ms: 150, gr_db: [1.5,3],  knee_db: 6, description: "שקוף מאוד" },
    { level: 8, ratio: 1.5, attack_ms: 40,  release_ms: 120, gr_db: [1,2],    knee_db: 6, description: "כמעט בלתי נשמע" }
  ],
  "detective": [
      { level: 1, base: { ratio: 6, attack_ms: 10, release_ms: 300, knee_db: 6, gr_db: [5,8] }, delta_factor: 3.0, description: "הבדלים גדולים מאוד" },
      { level: 2, base: { ratio: 5, attack_ms: 15, release_ms: 250, knee_db: 6, gr_db: [4,7] }, delta_factor: 2.5, description: "הבדלים גדולים" },
      { level: 3, base: { ratio: 4, attack_ms: 20, release_ms: 200, knee_db: 6, gr_db: [3,6] }, delta_factor: 2.0, description: "הבדלים ברורים" },
      { level: 4, base: { ratio: 3, attack_ms: 25, release_ms: 180, knee_db: 6, gr_db: [3,5] }, delta_factor: 1.8, description: "הבדלים מורגשים" },
      { level: 5, base: { ratio: 2.5, attack_ms: 30, release_ms: 150, knee_db: 6, gr_db: [2,4] }, delta_factor: 1.6, description: "הבדלים עדינים" },
      { level: 6, base: { ratio: 2, attack_ms: 35, release_ms: 120, knee_db: 6, gr_db: [2,3.5] }, delta_factor: 1.4, description: "הבדלים דקים" },
      { level: 7, base: { ratio: 2, attack_ms: 40, release_ms: 100, knee_db: 6, gr_db: [1.5,3] }, delta_factor: 1.3, description: "הבדלים קטנים מאוד" },
      { level: 8, base: { ratio: 1.8, attack_ms: 40, release_ms: 100, knee_db: 6, gr_db: [1,2.5] }, delta_factor: 1.2, description: "הבדלים זעירים" }
  ],
  "glue_vs_limiter": [
    { level: 1, paramsA: { name: "Glue", ratio: 2, attack_ms: 30, release_ms: 100, knee_db: 20, gr_db: [1, 2] }, paramsB: { name: "Limiter", ratio: 20, attack_ms: 0.1, release_ms: 10, knee_db: 0, gr_db: [5, 7] }, description: "הבדל קיצוני בדינמיקה ובעיוות" },
    { level: 2, paramsA: { name: "Glue", ratio: 2.5, attack_ms: 25, release_ms: 150, knee_db: 18, gr_db: [2, 3] }, paramsB: { name: "Limiter", ratio: 20, attack_ms: 0.2, release_ms: 20, knee_db: 0, gr_db: [4, 5] }, description: "הבדל GR קטן יותר" },
    { level: 3, paramsA: { name: "Glue", ratio: 3, attack_ms: 20, release_ms: 200, knee_db: 15, gr_db: [3, 4] }, paramsB: { name: "Limiter", ratio: 18, attack_ms: 0.3, release_ms: 30, knee_db: 0, gr_db: [3, 4] }, description: "GR זהה, אופי שונה" },
    { level: 4, paramsA: { name: "Glue", ratio: 4, attack_ms: 10, release_ms: 250, knee_db: 12, gr_db: [3, 4] }, paramsB: { name: "Limiter", ratio: 15, attack_ms: 0.5, release_ms: 40, knee_db: 2, gr_db: [3, 4] }, description: "Glue אגרסיבי יותר" },
    { level: 5, paramsA: { name: "Glue", ratio: 3.5, attack_ms: 15, release_ms: 200, knee_db: 12, gr_db: [2, 3] }, paramsB: { name: "Limiter", ratio: 10, attack_ms: 1, release_ms: 50, knee_db: 3, gr_db: [2, 3] }, description: "Limiter עדין יותר" },
    { level: 6, paramsA: { name: "Glue", ratio: 3, attack_ms: 18, release_ms: 180, knee_db: 10, gr_db: [2, 3] }, paramsB: { name: "Limiter", ratio: 8, attack_ms: 1.5, release_ms: 60, knee_db: 5, gr_db: [2, 3] }, description: "הבדלי Knee קטנים יותר" },
    { level: 7, paramsA: { name: "Glue", ratio: 2.5, attack_ms: 20, release_ms: 150, knee_db: 8, gr_db: [1.5, 2.5] }, paramsB: { name: "Limiter", ratio: 7, attack_ms: 2, release_ms: 70, knee_db: 4, gr_db: [1.5, 2.5] }, description: "הבדלי Attack/Release קטנים" },
    { level: 8, paramsA: { name: "Glue", ratio: 2, attack_ms: 25, release_ms: 120, knee_db: 6, gr_db: [1, 2] }, paramsB: { name: "Limiter", ratio: 6, attack_ms: 3, release_ms: 80, knee_db: 3, gr_db: [1, 2] }, description: "הבדלים דקים מאוד" }
  ]
};