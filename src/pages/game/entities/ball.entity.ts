import Vector2d from "@/pages/game/entities/vector2d.entity";

export default interface Ball{
    radius: number;
    speed: Vector2d;
    position: Vector2d;
}