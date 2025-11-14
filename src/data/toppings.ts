export interface Topping {
  name: string;
  price: number;
}

export interface ToppingsBySize {
  [size: string]: {
    [priceGroup: string]: Topping[];
  };
}

export interface AdditivesByItem {
  [itemName: string]: {
    [size: string]: {
      [priceGroup: string]: Topping[];
    };
  };
}

export const itemSpecificAdditives: AdditivesByItem = {
  'Nektar sok': {
    '1L': {
      '0': [
        { name: 'Jabuka', price: 0 },
        { name: 'Pomorandža', price: 0 },
        { name: 'Breskva', price: 0 }
      ]
    }
  }
};

export const toppings: ToppingsBySize = {
  '28cm': {
    '0': [
      { name: 'Kečap Blagi', price: 0 },
      { name: 'Kečap Ljuti', price: 0 }
    ],
    '200': [
      { name: 'Ananas', price: 200 },
      { name: 'Feferoni', price: 200 },
      { name: 'Feta', price: 200 },
      { name: 'Gorgonzola', price: 200 },
      { name: 'Jaje', price: 200 },
      { name: 'Kajmak', price: 200 },
      { name: 'Kačkavalj', price: 200 },
      { name: 'Kulen', price: 200 },
      { name: 'Majonez', price: 200 },
      { name: 'Masline', price: 200 },
      { name: 'Mocarela', price: 200 },
      { name: 'Morski plodovi', price: 200 },
      { name: 'Paradajz', price: 200 },
      { name: 'Parmezan', price: 200 },
      { name: 'Pavlaka', price: 200 },
      { name: 'Pečenica', price: 200 },
      { name: 'Pečurke', price: 200 },
      { name: 'Piletina', price: 200 },
      { name: 'Punjena ivica', price: 200 },
      { name: 'Rukola', price: 200 },
      { name: 'Susam', price: 200 },
      { name: 'Suvi vrat', price: 200 },
      { name: 'Tabasko', price: 200 },
      { name: 'Čili sos', price: 200 },
      { name: 'Šunka', price: 200 }
    ],
    '250': [
      { name: 'Pršuta', price: 250 }
    ]
  },
  '32cm': {
    '0': [
      { name: 'Kečap Blagi', price: 0 },
      { name: 'Kečap Ljuti', price: 0 }
    ],
    '250': [
      { name: 'Ananas', price: 250 },
      { name: 'Feferoni', price: 250 },
      { name: 'Feta', price: 250 },
      { name: 'Gorgonzola', price: 250 },
      { name: 'Jaje', price: 250 },
      { name: 'Kajmak', price: 250 },
      { name: 'Kačkavalj', price: 250 },
      { name: 'Kulen', price: 250 },
      { name: 'Majonez', price: 250 },
      { name: 'Masline', price: 250 },
      { name: 'Mocarela', price: 250 },
      { name: 'Morski plodovi', price: 250 },
      { name: 'Paradajz', price: 250 },
      { name: 'Parmezan', price: 250 },
      { name: 'Pavlaka', price: 250 },
      { name: 'Pečenica', price: 250 },
      { name: 'Pečurke', price: 250 },
      { name: 'Piletina', price: 250 },
      { name: 'Punjena ivica', price: 250 },
      { name: 'Rukola', price: 250 },
      { name: 'Susam', price: 250 },
      { name: 'Suvi vrat', price: 250 },
      { name: 'Tabasko', price: 250 },
      { name: 'Čili sos', price: 250 },
      { name: 'Šunka', price: 250 }
    ],
    '300': [
      { name: 'Pršuta', price: 300 }
    ]
  },
  '42cm': {
    '0': [
      { name: 'Kečap Blagi', price: 0 },
      { name: 'Kečap Ljuti', price: 0 }
    ],
    '300': [
      { name: 'Ananas', price: 300 },
      { name: 'Feferoni', price: 300 },
      { name: 'Feta', price: 300 },
      { name: 'Jaje', price: 300 },
      { name: 'Kulen', price: 300 },
      { name: 'Majonez', price: 300 },
      { name: 'Masline', price: 300 },
      { name: 'Paradajz', price: 300 },
      { name: 'Pavlaka', price: 300 },
      { name: 'Pečenica', price: 300 },
      { name: 'Pečurke', price: 300 },
      { name: 'Rukola', price: 300 },
      { name: 'Susam', price: 300 },
      { name: 'Suvi vrat', price: 300 },
      { name: 'Čili sos', price: 300 },
      { name: 'Šunka', price: 300 }
    ],
    '350': [
      { name: 'Gorgonzola', price: 350 },
      { name: 'Kajmak', price: 350 },
      { name: 'Kačkavalj', price: 350 },
      { name: 'Mocarela', price: 350 },
      { name: 'Morski plodovi', price: 350 },
      { name: 'Parmezan', price: 350 },
      { name: 'Piletina', price: 350 },
      { name: 'Pršuta', price: 350 },
      { name: 'Punjena ivica', price: 350 },
      { name: 'Tabasko', price: 350 }
    ]
  },
  '50cm': {
    '0': [
      { name: 'Kečap Blagi', price: 0 },
      { name: 'Kečap Ljuti', price: 0 }
    ],
    '350': [
      { name: 'Ananas', price: 350 },
      { name: 'Feferoni', price: 350 },
      { name: 'Feta', price: 350 },
      { name: 'Jaje', price: 350 },
      { name: 'Kulen', price: 350 },
      { name: 'Majonez', price: 350 },
      { name: 'Masline', price: 350 },
      { name: 'Paradajz', price: 350 },
      { name: 'Pavlaka', price: 350 },
      { name: 'Pečenica', price: 350 },
      { name: 'Pečurke', price: 350 },
      { name: 'Rukola', price: 350 },
      { name: 'Susam', price: 350 },
      { name: 'Suvi vrat', price: 350 },
      { name: 'Čili sos', price: 350 },
      { name: 'Šunka', price: 350 }
    ],
    '400': [
      { name: 'Gorgonzola', price: 400 },
      { name: 'Kajmak', price: 400 },
      { name: 'Kačkavalj', price: 400 },
      { name: 'Mocarela', price: 400 },
      { name: 'Morski plodovi', price: 400 },
      { name: 'Parmezan', price: 400 },
      { name: 'Piletina', price: 400 },
      { name: 'Pršuta', price: 400 },
      { name: 'Punjena ivica', price: 400 },
      { name: 'Tabasko', price: 400 }
    ]
  }
};
