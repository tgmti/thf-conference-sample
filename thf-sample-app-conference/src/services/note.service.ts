import { Injectable } from '@angular/core';

import { ThfSyncService } from '@totvs/thf-sync';

import { UserService } from './user.service';

@Injectable()
export class NoteService {
  constructor(private thfSync: ThfSyncService, private userService: UserService) { }

  getNoteModel() {
    return this.thfSync.getModel('Notes');
  }

  async getNote(lectureId) {
    const notes = await this.getNotes();
    return notes.find(note => note.lectureId === lectureId);
  }

  async getNotes() {
    const user = await this.userService.getLoggedUser();
    const notes = await this.getNoteModel().find().exec();
    return notes.items.filter(note => note.userId === user.id);
  }

  remove(note) {
    return this.getNoteModel().remove(note);
  }

  save(note) {
    // Melhor pratica!
    // return this.getNoteModel().save(note);
    return new Promise<any>((resolve, reject) => {
      this.getNoteModel().save(note).then(
        data => {
          console.log('Salvou com sucesso: ', data);
          resolve(data);
        }
      ).catch(
        err => {
          console.log('Erro ao salvar o fardo: ', err);
          reject(err);
        }
      );
    });
  }

  synchronize() {
    return this.thfSync.sync();
  }

}
