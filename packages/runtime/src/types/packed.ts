import {Float} from "./float";
import {INumeric} from "./_numeric";

export class Packed implements INumeric {
  private value: number;
  private readonly length: number;
  private readonly decimals: number;
  private readonly qualifiedName: string | undefined;

  public constructor(input?: {length?: number, decimals?: number, qualifiedName?: string}) {
    this.value = 0;

    this.length = 666;
    if (input?.length) {
      this.length = input.length;
    }

    this.decimals = 0;
    if (input?.decimals) {
      this.decimals = input.decimals;
    }

    this.qualifiedName = input?.qualifiedName;
  }

  public getQualifiedName() {
    return this.qualifiedName;
  }

  private round(value: number, places: number) {
    // @ts-ignore
    return +(Math.round(value + "e+" + places)  + "e-" + places);
  }

  public set(value: INumeric | number | string) {
    if (typeof value === "number") {
      this.value = value;
    } else if (typeof value === "string") {
      this.value = this.round(parseFloat(value), this.decimals);
    } else if (value instanceof Float) {
      this.value = this.round(value.getRaw(), this.decimals);
    } else {
      this.set(value.get());
    }
    return this;
  }

  public getLength() {
    return this.length;
  }

  public getDecimals() {
    return this.decimals;
  }

  public clear(): void {
    this.value = 0;
  }

  public get(): number {
    return this.value;
  }
}