import { useState } from "react"
import format from "date-fns/format"
import "./App.css"

type Student = {
  name: string
  major: string
  entryDate: Date
  graduationDate: Date
  gpa: number
}

function App() {
  const [students, setStudents] = useState<Student[]>([])
  const [sort, setSort] = useState({
    name: false,
    major: false,
    entryDate: false,
    graduationDate: false,
    gpa: false,
  })

  const reader = new FileReader()
  const handleFile: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files || event.target.files.length !== 1) return
    reader.readAsText(event.target.files[0])
  }
  reader.addEventListener("load", (event) => {
    if (typeof event.target?.result !== "string") return
    setStudents(
      event.target.result
        .split("\n")
        .slice(0, -1)
        .map((line) => {
          const [name, major, entryDate, graduationDate, gpa] = line.split(",")
          return {
            name,
            major,
            entryDate: new Date(Date.parse(entryDate)),
            graduationDate: new Date(Date.parse(graduationDate)),
            gpa: parseFloat(gpa),
          }
        })
    )
  })
  const sortBy = (key: keyof Student) => {
    setSort({ ...sort, [key]: !sort[key] })
    setStudents(
      students.sort((a, b) =>
        sort[key] ? +a[key] - +b[key] : +b[key] - +a[key]
      )
    )
  }

  return (
    <div className="m-2 md:m-8">
      <input type="file" onChange={handleFile} />
      {students.length > 0 && (
        <table className="w-full mt-4 text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Major</th>
              <th
                className="cursor-pointer"
                onClick={() => sortBy("entryDate")}
              >
                Entry Date
              </th>
              <th
                className="cursor-pointer"
                onClick={() => sortBy("graduationDate")}
              >
                <span className="hidden md:inline">Graduation Date</span>
                <span className="md:hidden">Grad Date</span>
              </th>
              <th className="cursor-pointer" onClick={() => sortBy("gpa")}>
                GPA
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.name}>
                <td>{student.name}</td>
                <td>{student.major}</td>
                <td>{format(student.entryDate, "yyyy-MM-dd")}</td>
                <td>{format(student.graduationDate, "yyyy-MM-dd")}</td>
                <td>{student.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
