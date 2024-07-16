import { Modal, getCategories, getProducts } from '../../../global.js'
import { firestore, app} from '../../../configs/firebaseConfig.js'

const db = firestore.getFirestore(app)
