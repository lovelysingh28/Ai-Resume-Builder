export default function ResumePreview({ resumeData }) {
  return (
    <div
      id="resume-preview"
      className="bg-white p-8 shadow-lg"
    >
      <h1 className="text-3xl font-bold">
        {resumeData.name}
      </h1>

      <h2 className="mt-4 font-semibold">
        Skills
      </h2>

      <p>{resumeData.skills}</p>
    </div>
  )
}