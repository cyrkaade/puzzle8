export function generateUsername() {
    let username = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < 15; i++) {
      username += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return username;
  }