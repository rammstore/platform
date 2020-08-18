import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import localeRu from '@angular/common/locales/ru';

@Directive({
    selector: '[forbiddenSymbols]'
})

export class ForbiddenSymbolsDirective {
    @Input() forbiddenSymbols: string;
    private row: string;

    private abcLowerCase = 'abcdefghijklmnopqrstuvwxyz';
    private abcUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private rusLowerCase = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    private rusUpperCase = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

    private digits = '0123456789';

    constructor(private el: ElementRef) {
      debugger
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        var array;

        this.row = '';
        this.forbiddenSymbols = this.forbiddenSymbols || '';

        if (this.forbiddenSymbols.indexOf('0-9')>=0) {
            [0,1,2,3,4,5,6,7,8,9].forEach((x)=>{
                this.row += x+',';
            })
        }
        if (this.forbiddenSymbols.indexOf('А-Я')>=0) {
            let array = this.rusUpperCase.split('');

            array.forEach((x)=>{
                this.row += x+',';
            })
        }

        if (this.forbiddenSymbols.indexOf('а-я')>=0) {
            let array = this.rusLowerCase.split('');

            array.forEach((x)=>{
                this.row += x+',';
            })
        }

        if (this.forbiddenSymbols.indexOf('A-Z')>=0) {
            let array = this.abcUpperCase.split('');

            array.forEach((x)=>{
                this.row += x+',';
            })
        }

        if (this.forbiddenSymbols.indexOf('a-z')>=0) {
            let array = this.abcLowerCase.split('');

            array.forEach((x)=>{
                this.row += x+',';
            })
        }

        array = (this.row || this.forbiddenSymbols).split(",");

        array.filter((x)=>{
            if (x == event.key) {
                event.preventDefault();
            }
        })
    }

    @HostListener('blur', ['$event'])
    onBlur(event: KeyboardEvent) {
        var newString = '';
        this.forbiddenSymbols = this.forbiddenSymbols || '';

        if (this.forbiddenSymbols.indexOf('0-9')>=0) {
            this.forbiddenSymbols = '[0,1,2,3,4,5,6,7,8,9]';
        }

        event.target['value'].split('').filter((x)=>{
            if (this.forbiddenSymbols.indexOf(x) < 0) {
                newString += x;
            }
        })
        event.target['value'] = newString;
    }
}
