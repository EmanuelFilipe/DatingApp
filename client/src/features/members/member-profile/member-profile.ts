import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { EditableMember } from '../../../types/editable-member'
import { ToastService } from '../../../core/services/toast-service';
import { FormsModule, NgForm } from '@angular/forms';
import { Member } from '../../../types/member';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  private toast = inject(ToastService)
  private accountService = inject(AccountService)
  protected memberService = inject(MemberService) 

  @ViewChild('editForm') editForm?: NgForm

  // >> executa a validação quando der reflesh na tela
  // o host nesse contexto é o browser
  // notify irá avisar de algo antes do evento unload
  @HostListener('window:beforeunload', ['$event']) notify($event:BeforeUnloadEvent) {
    if(this.editForm?.dirty)
      $event.preventDefault()
  }

  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  }


  ngOnInit(): void {
    // os dados estao no pai
    // this.route.parent?.data.subscribe(data => {
    //   this.member.set(data['member'])
    // })

    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || ''
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return

    debugger
    const updatedMember = {...this.memberService.member(), ...this.editableMember}
    this.memberService.updateMember(updatedMember).subscribe({
      next: () => {
        this.updateCurrentUser(updatedMember as Member)
        this.toast.success('Profile updated successfully')
        this.memberService.editMode.set(false)
        this.memberService.member.set(updatedMember as Member)
        this.editForm?.reset(updatedMember)
      }
    })
  }

  updateCurrentUser(updatedMember: Member) {
    const currentUser = this.accountService.currentUser()

    if (currentUser && updatedMember.displayName !== currentUser?.displayName) {
      currentUser.displayName = updatedMember.displayName
      this.accountService.setCurrentUser(currentUser)
    }
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false)
    }
  }
}
