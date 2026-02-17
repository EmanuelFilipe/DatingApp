import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/photo';
//import { AsyncPipe } from '@angular/common';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/users';
import { Member } from '../../../types/member';
import { StarButton } from "../../../shared/star-button/star-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  private route = inject(ActivatedRoute)
  protected accountService = inject(AccountService)
  protected memberService = inject(MemberService)
  protected photos = signal<Photo[]>([])
  protected loading = signal(false)
  
  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id')

    if (memberId) {

      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      })
    }
  }

  get photoMocks() {
    return Array.from({ length: 20 }, (_, i) => ({
      url: '/user.png'
    }))
  }

  onUploadImage(file: File) {
    this.loading.set(true)  
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false)
        this.loading.set(false)
        this.photos.update(photos => [...photos, photo])
      },
      error: error => {
        console.error('Error uploading photo:', error)
        this.loading.set(false)
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser()
        if (currentUser) currentUser.imgUrl = photo.url
        this.accountService.setCurrentUser(currentUser as User)
        this.memberService.member.update(member => ({
          ...member, 
          imageUrl: photo.url}) as Member)
      },
      error: error => console.error('Error setting main photo:', error)
    })
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photo.id))
      },
      error: error => console.error('Error deleting photo:', error)
    })  
  }
}
