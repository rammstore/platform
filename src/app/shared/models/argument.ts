export class Argument{
    searchMode: string;
    dealsMin: number;
    ageMin: number;
    yieldMin: number;
    field: string;
    direction: string;

    constructor(
        options: any
      ) {
        Object.assign(this, options);
      }
}