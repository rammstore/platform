export class Rating{
    Name: string;
    AgeMin: number;
    DealsMin: number;
    YieldMin: number;
    OrderBy: number;

    constructor(
        options: any
      ) {
        Object.assign(this, options);
      }
}