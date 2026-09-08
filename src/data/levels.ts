import type { LevelData } from '../types';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    levelNumber: 1,
    title: "مرحلة 1",
    theme: "صندوق الانتخابات",
    imageSvgType: 'election',
    cols: 6,
    rows: 6,
    // 36 cells (6x6)
    // Row 0: [0: م], [1: ر], [2: ش], [3: ح], [4: ''], [5: ت]
    // Row 1: [6: ص], [7: ن], [8: د], [9: و], [10: ق], [11: ص]
    // Row 2: [12: ل], [13: و], [14: ''], [15: ب], [16: ا], [17: و]
    // Row 3: [18: ج], [19: س], [20: ر], [21: س], [22: د], [23: ي]
    // Row 4: [24: ن], [25: ي], [26: ي], [27: ق], [28: م], [29: ت]
    // Row 5: [30: ة], [31: ص], [32: و], [33: ت], [34: ة], [35: '']
    grid: [
      'م', 'ر', 'ش', 'ح', '',  'ت',
      'ص', 'ن', 'د', 'و', 'ق', 'ص',
      'ل', 'و', '',  'ب', 'ا', 'و',
      'ج', 'س', 'ر', 'س', 'د', 'ي',
      'ن', 'ي', 'ي', 'ق', 'م', 'ت',
      'ة', 'ص', 'و', 'ت', 'ة', ''
    ],
    targetWords: [
      {
        id: 'w1_1',
        word: 'صندوق',
        color: 'purple',
        indices: [6, 7, 8, 9, 10] // Horizontal
      },
      {
        id: 'w1_2',
        word: 'تصويت',
        color: 'green',
        indices: [5, 11, 17, 23, 29] // Vertical
      },
      {
        id: 'w1_3',
        word: 'مرشح',
        color: 'orange',
        indices: [0, 1, 2, 3] // Horizontal
      },
      {
        id: 'w1_4',
        word: 'لجنة',
        color: 'amber',
        indices: [12, 18, 24, 30] // Vertical
      },
      {
        id: 'w1_5',
        word: 'صوت',
        color: 'pink',
        indices: [31, 32, 33] // Horizontal
      },
      {
        id: 'w1_6',
        word: 'ورقة',
        color: 'blue',
        indices: [13, 20, 27, 34] // Diagonal: 13 (r2,c1) -> 20 (r3,c2) -> 27 (r4,c3) -> 34 (r5,c4)
      }
    ]
  },
  {
    id: 2,
    levelNumber: 2,
    title: "مرحلة 2",
    theme: "عسل النحل",
    imageSvgType: 'honey',
    cols: 6,
    rows: 6,
    grid: [
      'ع', 'س', 'ل', 'ن', 'ح', 'ل',
      'ر', 'خ', '',  'ب', 'ر', 'ح',
      'ح', 'ل', 'و', 'ي', 'ش', 'ل',
      'ي', 'ي', 'ر', 'ق', 'ه', 'و',
      'ق', 'ة', 'ش', 'م', 'ع', '',
      '',  'ط', 'ع', 'م', 'ل', 'ذ'
    ],
    targetWords: [
      {
        id: 'w2_1',
        word: 'عسل',
        color: 'amber',
        indices: [0, 1, 2] // Horizontal
      },
      {
        id: 'w2_2',
        word: 'نحل',
        color: 'green',
        indices: [3, 4, 5] // Horizontal
      },
      {
        id: 'w2_3',
        word: 'رحيق',
        color: 'purple',
        indices: [6, 12, 18, 24] // Vertical
      },
      {
        id: 'w2_4',
        word: 'حلو',
        color: 'orange',
        indices: [5, 11, 17] // Vertical: Col 5 (r0,c5), (r1,c5), (r2,c5) -> [5: ل], [11: ح], [17: و] -> حلو (reverse)
      },
      {
        id: 'w2_5',
        word: 'شمع',
        color: 'blue',
        indices: [26, 27, 28] // Horizontal
      },
      {
        id: 'w2_6',
        word: 'خلية',
        color: 'pink',
        indices: [7, 13, 19, 25] // Vertical: Col 1
      }
    ]
  },
  {
    id: 3,
    levelNumber: 3,
    title: "مرحلة 3",
    theme: "شاطئ البحر",
    imageSvgType: 'sun_beach',
    cols: 6,
    rows: 6,
    grid: [
      'ش', 'م', 'س', 'ب', 'ح', 'ر',
      'ر', 'ي', 'ا', 'ح', '',  'س',
      'م', 'و', 'ج', 'ء', 'ا', 'ف',
      'ل', 'ا', '',  'م', 'ر', 'ي',
      'م', 'ظ', 'ل', 'ة', 'ق', 'ن',
      '',  'ش', 'ا', 'ط', 'ئ', 'ة'
    ],
    targetWords: [
      {
        id: 'w3_1',
        word: 'شمس',
        color: 'amber',
        indices: [0, 1, 2] // Horizontal
      },
      {
        id: 'w3_2',
        word: 'بحر',
        color: 'blue',
        indices: [3, 4, 5] // Horizontal
      },
      {
        id: 'w3_3',
        word: 'رمل',
        color: 'orange',
        indices: [6, 12, 18] // Vertical: Col 0
      },
      {
        id: 'w3_4',
        word: 'موج',
        color: 'green',
        indices: [12, 13, 14] // Horizontal: Row 2
      },
      {
        id: 'w3_5',
        word: 'سفينة',
        color: 'purple',
        indices: [11, 17, 23, 29, 35] // Vertical: Col 5
      },
      {
        id: 'w3_6',
        word: 'مظلة',
        color: 'pink',
        indices: [24, 25, 26, 27] // Horizontal: Row 4
      },
      {
        id: 'w3_7',
        word: 'شاطئ',
        color: 'cyan',
        indices: [31, 32, 33, 34] // Horizontal: Row 5
      }
    ]
  },
  {
    id: 4,
    levelNumber: 4,
    title: "مرحلة 4",
    theme: "فنجان القهوة",
    imageSvgType: 'coffee',
    cols: 6,
    rows: 6,
    grid: [
      'ق', 'ه', 'و', 'ة', '',  'ف',
      'ب', 'ن', '',  'ه', 'ي', 'ن',
      'د', 'ل', 'ة', 'ي', 'ل', 'ج',
      'س', 'ا', 'خ', 'ن', '',  'ا',
      '',  'ر', 'ا', 'ئ', 'ح', 'ن',
      'ض', 'ي', 'ا', 'ف', 'ة', ''
    ],
    targetWords: [
      {
        id: 'w4_1',
        word: 'قهوة',
        color: 'purple',
        indices: [0, 1, 2, 3] // Horizontal
      },
      {
        id: 'w4_2',
        word: 'بن',
        color: 'green',
        indices: [6, 7] // Horizontal
      },
      {
        id: 'w4_3',
        word: 'دلة',
        color: 'amber',
        indices: [12, 13, 14] // Horizontal
      },
      {
        id: 'w4_4',
        word: 'ساخن',
        color: 'orange',
        indices: [18, 19, 20, 21] // Horizontal
      },
      {
        id: 'w4_5',
        word: 'فنجان',
        color: 'pink',
        indices: [5, 11, 17, 23, 29] // Vertical: Col 5
      },
      {
        id: 'w4_6',
        word: 'ضيافة',
        color: 'blue',
        indices: [30, 31, 32, 33, 34] // Horizontal
      }
    ]
  },
  {
    id: 5,
    levelNumber: 5,
    title: "مرحلة 5",
    theme: "رحلة الفضاء",
    imageSvgType: 'space_rocket',
    cols: 6,
    rows: 6,
    grid: [
      'ص', 'ا', 'ر', 'و', 'خ', 'ق',
      'ف', 'ض', 'ا', 'ء', '',  'م',
      'ك', 'و', 'ك', 'ب', 'س', 'ر',
      'ن', 'ج', 'م', '',  'ف', 'ن',
      'م', 'د', 'ا', 'ر', 'ي', 'ي',
      '',  'ك', 'و', 'ن', 'ة', 'ز'
    ],
    targetWords: [
      {
        id: 'w5_1',
        word: 'صاروخ',
        color: 'orange',
        indices: [0, 1, 2, 3, 4] // Horizontal
      },
      {
        id: 'w5_2',
        word: 'فضاء',
        color: 'blue',
        indices: [6, 7, 8, 9] // Horizontal
      },
      {
        id: 'w5_3',
        word: 'كوكب',
        color: 'purple',
        indices: [12, 13, 14, 15] // Horizontal
      },
      {
        id: 'w5_4',
        word: 'قمر',
        color: 'green',
        indices: [5, 11, 17] // Vertical: Col 5
      },
      {
        id: 'w5_5',
        word: 'نجم',
        color: 'amber',
        indices: [18, 19, 20] // Horizontal
      },
      {
        id: 'w5_6',
        word: 'مدار',
        color: 'pink',
        indices: [24, 25, 26, 27] // Horizontal
      }
    ]
  }
];
