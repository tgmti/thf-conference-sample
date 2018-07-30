import { Component } from '@angular/core';

import { AlertController, NavController, NavParams, ToastController } from 'ionic-angular';

import { NoteListPage } from './../note-list/note-list.component';
import { NoteService } from '../../services/note.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'page-note-detail',
  templateUrl: 'note-detail.component.html'
})
export class NoteDetailPage {
  note = { title: 'New note', text: null, lectureId: undefined, userId: undefined };

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private noteService: NoteService,
    private userService: UserService,
  ) { }

  ionViewDidLoad() {
    this.initNote();
  }

  alertRemoveNote() {
    const alert = this.alertCtrl.create({
      title: `Remove ${this.note.title}`,
      message: 'Would you like to remove this note?',
      buttons: [
        { text: 'Cancel', handler: () => { } },
        { text: 'Remove', handler: () => this.removeNote() }
      ]
    });
    alert.present();
  }

  async saveNote() {
    const notes = await this.noteService.getNotes();

    //// Melhor pratica!
    // for (const element of notes) {
    //   element.text = this.note.text;
    //   try {
    //     await this.noteService.save(element);
    //   } catch (err) {
    //     break;
    //   }
    // }

    let saved = true;
    for (const element of notes) {
      element.text = this.note.text;
      await this.noteService.save(element).catch(err => {
        saved = false;
      });
      if (!saved) {
        break;
      }
    }

    const toast = this.toastCtrl.create({
      message: 'Saved note',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
    this.navCtrl.setRoot(NoteListPage);
  }

  private async initNote() {
    const note = await this.noteService.getNote(this.navParams.data.lectureId);
    this.note = note || this.note;
  }

  private async removeNote() {
    await this.noteService.remove(this.note);
    this.navCtrl.setRoot(NoteListPage);
  }

}
