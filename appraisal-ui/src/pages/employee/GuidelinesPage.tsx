export default function GuidelinesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Self Evaluation Guidelines
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Achievements */}
        <div className="card">
          <h2 className="section-header">
            Achievements (What you did well)
          </h2>

          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>Approved assigned projects on time with quality output</li>
            <li>Contributed to team success and collaboration</li>
            <li>Improved performance or efficiency</li>
            <li>Learned and applied new technologies or tools</li>
          </ul>

          <div className="mt-4 rounded-xl bg-[#F4F8FF] p-4">
            <p className="font-semibold text-[#0E4CB7]">Example</p>
            <p>Approved Project A before deadline and improved load time by 20%</p>
            <p>Helped teammates resolve issues and ensured smooth delivery</p>
          </div>
        </div>

        {/* Improvements */}
        <div className="card">
          <h2 className="section-header">
            Improvements (Areas to work on)
          </h2>

          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>Time management and task prioritization</li>
            <li>Documentation and reporting</li>
            <li>Code quality and standards</li>
            <li>Learning new skills or tools</li>
          </ul>

          <div className="mt-4 rounded-xl bg-[#F4F8FF] p-4">
            <p className="font-semibold text-[#0E4CB7]">Example</p>
            <p>Need to improve task estimation accuracy</p>
            <p>Should focus more on maintainable code practices</p>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <h2 className="section-header">
            Skills (What you can add)
          </h2>

          <p className="mb-4 text-gray-700">
            Include both technical and soft skills.
          </p>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-[#0E4CB7]">Technical Skills</p>
              <p>Java, Spring Boot, React, MySQL, REST APIs</p>
            </div>

            <div>
              <p className="font-semibold text-[#0E4CB7]">Soft Skills</p>
              <p>Communication, Teamwork, Problem Solving</p>
            </div>
          </div>
        </div>

        {/* Organizational Work */}
        <div className="card">
          <h2 className="section-header">
            Organizational Work (Extra Contributions)
          </h2>

          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>Participation in company activities</li>
            <li>Helping team members or mentoring juniors</li>
            <li>Taking initiative beyond assigned work</li>
            <li>Contributing to team culture or events</li>
          </ul>
        </div>

      </div>
    </div>
  );
}