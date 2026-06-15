import { useEffect, useState } from "react"

export default function ResumeForm({
  resumeData,
  setResumeData
}) {

  const [image, setImage] = useState(null)

  useEffect(() => {

    const savedData =
      localStorage.getItem("resume")

    if (savedData) {
      setResumeData(JSON.parse(savedData))
    }

  }, [])

  const handleChange = (e) => {

    const updatedData = {
      ...resumeData,
      [e.target.name]: e.target.value
    }

    setResumeData(updatedData)

    localStorage.setItem(
      "resume",
      JSON.stringify(updatedData)
    )
  }

  const handleImageUpload = (e) => {

    const file = e.target.files[0]

    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }

  return (

    <div className="p-4 space-y-4">

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="w-full border p-2 rounded"
        value={resumeData?.name || ""}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={resumeData?.email || ""}
        onChange={handleChange}
      />

      <textarea
        name="skills"
        placeholder="Skills"
        className="w-full border p-2 rounded"
        value={resumeData?.skills || ""}
        onChange={handleChange}
      />

      <input
        type="file"
        onChange={handleImageUpload}
      />

      {
        image && (
          <img
            src={image}
            alt="Profile"
            className="w-32 h-32 rounded-full"
          />
        )
      }

    </div>
  )
}