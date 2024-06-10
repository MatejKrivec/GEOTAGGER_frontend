interface GuessInterface {
    id: number;
    UserID: number;
    LocationID: number;
    guessedLocation: string;
    distance: number;
    date: Date;
  }

  export default GuessInterface;