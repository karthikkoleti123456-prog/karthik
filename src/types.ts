/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
