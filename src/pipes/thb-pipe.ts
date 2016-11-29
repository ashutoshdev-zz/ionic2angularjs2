import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | currencyTHB
 * Example:
 *   {{ 222.22 |  currencyTHB}}
 *   formats to: ฿ 222.22
 */
@Pipe({name: 'currencyTHB'})
/**
 * Class currencyTHB A custom pipe for showing thai currency.
 * @constructor
 */
export class CurrencyTHB implements PipeTransform {
    transform(value: number): string {
        return '฿ '+ value;
    }
}