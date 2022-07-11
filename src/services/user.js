import db from '../firebase/config.js'

const getDataUser = () => {
    const events = db.collection('user')
    events.get().then((querySnapshot) => {
        const tempDoc = []
        querySnapshot.forEach((doc) => {
           tempDoc.push({ id: doc.id, ...doc.data() })
        })

        return tempDoc
    })
}


console.log(getDataUser);

export default getDataUser