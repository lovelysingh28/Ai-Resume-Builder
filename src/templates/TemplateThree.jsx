export default function TemplateThree({ resumeData }) {

  return (
    <div className="template-three">

      <center>
        <h1>{resumeData.name}</h1>
        <p>{resumeData.email}</p>
        <p>{resumeData.phone}</p>
      </center>

      <h2>Skills</h2>
      <p>{resumeData.skills}</p>

      <h2>Education</h2>
      <p>{resumeData.education}</p>

      <h2>Experience</h2>
      <p>{resumeData.experience}</p>

    </div>
  )
}