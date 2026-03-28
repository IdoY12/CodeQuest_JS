import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type DuelReplayRound = {
  roundNumber: number;
  player1TimeMs: number;
  player2TimeMs: number;
  winnerUserId: string | null;
  correctAnswer?: string;
};

export type DuelStackParamList = {
  DuelHome: undefined;
  Matchmaking: undefined;
  ActiveDuel: undefined;
  DuelResults: { won: boolean; score: string; replay?: DuelReplayRound[] };
};

export type DuelHomeScreenProps = NativeStackScreenProps<DuelStackParamList, "DuelHome">;

export type MatchmakingScreenProps = NativeStackScreenProps<DuelStackParamList, "Matchmaking">;

export type ActiveDuelScreenProps = NativeStackScreenProps<DuelStackParamList, "ActiveDuel">;

export type DuelResultsScreenProps = NativeStackScreenProps<DuelStackParamList, "DuelResults">;
