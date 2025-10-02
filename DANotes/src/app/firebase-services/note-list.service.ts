import { inject, Injectable } from '@angular/core';
import { doc, Firestore, collection, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore = inject(Firestore);
  // items$;
  // items;

  unsubTrash;
  unsubNotes;
  // unsubSingle;

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();

    // this.unsubSingle = onSnapshot(this.getSingleDocRef('notes', 'KiDBX9geELld4H9FAfZP'), (element) => {
    //   console.log(element);
    // });

    // this.items$ = collectionData(this.getNotesRef());

    // this.items = this.items$.subscribe((list) => {
    //   list.forEach((element) => {
    //     console.log(element);
    //   });
    // });
  }
  // const itemCollection = collection(this.firestore, 'items');

  setNoteObject(obj: any, id: string): Note {
    const note: Note = {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    };
    return note;
  }

  ngOnDestroy() {
    // this.items.unsubscribe(); // to unsubscribe from observable
    // this.unsubSingle(); // to unsubscribe from single doc listener
    this.unsubTrash();
    this.unsubNotes();
  }

  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList(){
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {         // colId = collection ID, docId = document ID
    return doc(collection(this.firestore, colId), docId);
  }
}
