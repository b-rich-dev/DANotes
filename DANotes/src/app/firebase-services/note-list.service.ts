import { inject, Injectable } from '@angular/core';
import {
  doc,
  Firestore,
  collection,
  collectionData,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  markedNotes: Note[] = [];

  firestore = inject(Firestore);
  // items$;
  // items;

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;
  // unsubSingle;

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.submarkedNotesList();

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

  async deleteNote(colId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => { console.error(err); }
    ).then(
      () => console.log('Document successfully deleted!')
    );
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id)
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.error(err); }
      ).then(
        () => console.log('Document successfully updated!')
      );
    }
  }

  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }

  getColIdFromNote(note: Note): string {
    if (note.type === "note") {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, colId?: "notes" | "trash") {
    const collection = colId === "trash" ? this.getTrashRef() : this.getNotesRef();
    await addDoc(collection, this.getCleanJson(item)).catch(
      (err) => { console.error(err); }
    ).then(
      (docRef) => console.log('docRef:', docRef?.id)
    );
  }

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
    this.unsubMarkedNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
      list.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New note: ", change.doc.data());
        }
        if (change.type === "modified") {
          console.log("Modified note: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed note: ", change.doc.data());
        }
      });
    });
  }

  // Original version:
  subNotesList() {
    const notesQuery = query(this.getNotesRef(), limit(5)); // orderBy("title")
    return onSnapshot(notesQuery, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  // Test version:
  // subNotesList() {
  //   // let ref = collection(doc(collection(this.firestore, "notes"), "1s48wFXKMZ5v4NZFn9d7"), "notesExtra");
  //   let ref = collection(this.firestore, 'notes/1s48wFXKMZ5v4NZFn9d7/notesExtra');
  //   console.log('🔍 Zugriff auf notesExtra Subcollection in Dokument 1s48wFXKMZ5v4NZFn9d7');
  //   const notesQuery = query(ref, limit(5)); // orderBy("title")
  //   return onSnapshot(notesQuery, (list) => {
  //     this.normalNotes = [];
  //     list.forEach((element) => {
  //       this.normalNotes.push(this.setNoteObject(element.data(), element.id));
  //     });
  //   });
  // }

  submarkedNotesList() {
    const notesQuery = query(this.getNotesRef(), where("marked", "==", true), limit(50)); // orderBy("title")
    return onSnapshot(notesQuery, (list) => {
      this.markedNotes = [];
      list.forEach((element) => {
        this.markedNotes.push(this.setNoteObject(element.data(), element.id));
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
