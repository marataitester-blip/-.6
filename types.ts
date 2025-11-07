
export interface TarotCardData {
  id: number;
  name: string;
  keyword: string;
  videoUrl: string;
  interpretation: {
    short: string;
    long: string;
    advice: {
      relationships: string;
      health: string;
      money: string;
    };
    intent: string;
  };
}
