import { useState } from 'react';

export function useItems() {
    const [items, setItems] = useState([]);
    return { items, setItems };
  }
