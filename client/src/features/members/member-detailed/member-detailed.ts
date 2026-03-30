import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
import { PresenceService } from '../../../core/services/presence-service';
import { LikesService } from '../../../core/services/likes-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {
  private routeId = signal<string | null>(null)
  // da acesso aos parametros na url
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private accountService = inject(AccountService)
  protected likesService = inject(LikesService)
  protected memberService = inject(MemberService) // we´ll access inside the component
  protected presenceService = inject(PresenceService)
  protected title = signal<string | undefined>('Profile')
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.routeId()
  })
  protected hasLiked = computed(() => this.likesService.likeIds().includes(this.routeId()!))

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.routeId.set(params.get('id'))
    })
  }

  ngOnInit() {
    // this.route.data.subscribe({
    //   next: data => {
    //     // obtem o valor retornado do resolver
    //     this.member.set(data['member'])
    //   }
    // })
    this.title.set(this.route.firstChild?.snapshot?.title)

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }

}
