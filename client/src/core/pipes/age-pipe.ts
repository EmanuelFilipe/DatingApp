import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: string): number {
    const today = new Date()
    const dayOfBirth = new Date(value)
    const monthDiff = today.getMonth() - dayOfBirth.getMonth()

    let age = today.getFullYear() - dayOfBirth.getFullYear()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dayOfBirth.getDate())) {
      age--
    }

    return age
  }

}
