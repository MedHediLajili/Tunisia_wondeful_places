import { Place } from './place';
import { State } from './state';
import { Image } from './image';
import { Reaction } from './reaction';
export class PlaceCard {
  place: Place;
  images: Image[];
  state: State;
  indexes: number[];
  reaction: Reaction;
}
