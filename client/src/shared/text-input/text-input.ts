import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormControlName, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css',
})
export class TextInput implements ControlValueAccessor {
  id = input<string>('')
  label = input<string>('')
  type = input<string>('text')
  maxDate = input<string>('')

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  writeValue(obj: any): void {
    
  }
  registerOnChange(fn: any): void {
    
  }
  registerOnTouched(fn: any): void {
    
  }
  setDisabledState?(isDisabled: boolean): void {
    
  }

  
}
