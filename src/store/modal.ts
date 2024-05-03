import { Post } from "@/model/Post";
import { create } from "zustand";

interface ModalState {
  mode: 'new' | 'comment';
  data: Post | null; // data 속성은 Post 타입 또는 null일 수 있도록 수정
  setMode(mode: 'new' | 'comment'): void;
  setData(data: Post | null): void; // setData 메서드의 매개변수 타입도 Post 타입 또는 null로 수정
  reset(): void;
}

export const useModalState = create<ModalState>((set) => ({
  mode: 'new',
  data: null, // 초기값으로 null 제공
  setMode(mode) {
    set({ mode });
  },
  setData(data) {
    set({ data });
  },
  reset() {
    set({
      mode: 'new',
      data: null,
    });
  }
}));
