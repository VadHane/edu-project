import { Vector2 } from 'three';
import {
    DEFAULT_ANGLE_X,
    DEFAULT_ANGLE_Y,
} from '../../utils/OrbitControls/OrbitControls.constants';

export const FRONT_POSITION = new Vector2(0, 0);
export const BACK_POSITION = new Vector2(Math.PI, 0);
export const LEFT_POSITION = new Vector2(Math.PI / 2, 0);
export const RIGHT_POSITION = new Vector2(-Math.PI / 2, 0);
export const TOP_POSITION = new Vector2(0, Math.PI / 2 - 0.15);
export const BOTTOM_POSITION = new Vector2(0, -Math.PI / 2 + 0.15);
export const DEFAULT_POSITION = new Vector2(DEFAULT_ANGLE_X, DEFAULT_ANGLE_Y);
