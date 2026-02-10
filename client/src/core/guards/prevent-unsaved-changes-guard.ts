import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/members/member-profile/member-profile';

// component é o nome do componente que será removido
export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  // se foi alterado
  if (component.editForm?.dirty) {
    return confirm('Are you sure you want to continue? All unsaved changes will be lost')
  }

  return true
};
