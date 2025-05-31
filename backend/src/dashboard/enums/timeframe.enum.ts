import { registerEnumType } from "@nestjs/graphql";

export enum TimeFrame {
    DAY,
    WEEK,
    MONTH
}

registerEnumType (TimeFrame, {
    name: "TimeFrame"
});