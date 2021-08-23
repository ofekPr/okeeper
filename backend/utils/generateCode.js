const generateCode = (length) => {
    let result = '';
    const characters = '1234567890';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
      if(result.length == 3) {
        result += '-'
      }
   }

   return result;
}

export default generateCode