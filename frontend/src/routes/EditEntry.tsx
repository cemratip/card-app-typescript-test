import {useState, useContext, ChangeEvent, MouseEvent, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {EntryContext} from '../utilities/globalContext'
import {Entry, EntryContextType} from '../@types/context'

export default function EditEntry(){
    const {id} = useParams()
    const emptyEntry: Entry = {title: "", description: "", created_at: new Date(), scheduled_at: new Date()}

    const { updateEntry, entries } = useContext(EntryContext) as EntryContextType
    const [newEntry,setNewEntry] = useState<Entry>(emptyEntry)

    useEffect(() =>{
        const entry = entries.filter(entry=> entry.id == id)[0]
        setNewEntry(entry)
    },[])
    const handleInputChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setNewEntry({
            ...newEntry,
            [event.target.name] : event.target.value
        })
    }
    const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
        updateEntry(id as string,newEntry)
    }
    return(
      <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 p-8 rounded-md">
          <input className="p-3 rounded-md" type="text" placeholder="Title" name="title" value={newEntry.title}
                 onChange={handleInputChange} />
          <textarea className="p-3 rounded-md" placeholder="Description" name="description" value={newEntry.description}
                    onChange={handleInputChange} />
          <div className="space-y-2">
              <p className="font-bold">Created</p>
              <input className="p-3 rounded-md w-full" type="date" name="created_at"
                     value={(new Date(newEntry.created_at)).toISOString().split('T')[0]} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
              <p className="font-bold">Scheduled</p>
              <input className="p-3 rounded-md w-full" type="date" name="scheduled_at"
                     value={(new Date(newEntry.scheduled_at)).toISOString().split('T')[0]}
                     onChange={handleInputChange} />
          </div>
          <button onClick={(e) => {
              handleSend(e)
          }} className="bg-blue-400 hover:bg-blue-600 font-semibold text-white p-3 rounded-md">Update
          </button>
      </section>
    )
}