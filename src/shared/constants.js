module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 0,
  PLAYER_FIRE_COOLDOWN: 0.25,

  CARDS_WITH: 100,
  CARDS_HEIGHT: 150,
 
  BULLET_RADIUS: 0,
  BULLET_SPEED: 0,
  BULLET_DAMAGE: 0,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAP_SIZE: 1000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },
});
