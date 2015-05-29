// Generator function
export

function * dictEntriesGen(obj) {

  for (let key of Object.keys(obj)) yield[key, obj[key]];

}

export
let session = new Object();

// Generator comprehensions (ES7)
// export

// function dictEntries(obj) {
//   return (
//     for (key of Object.keys(obj))[key, obj[key]]);
// }