import { useState } from "react";

export default function GuidelinesPage() {
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Self Evaluation Guidelines
        </h1>

        <button
          onClick={() => setShowSample(!showSample)}
          className="rounded-lg bg-[#0E4CB7] px-5 py-2 text-white hover:bg-[#0b3d96] transition"
        >
          {showSample ? "View Guidelines" : "Sample Appraisal"}
        </button>
      </div>

      {!showSample ? (

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Achievements */}
          <div className="card">
            <h2 className="section-header">
              Achievements (What you did well)
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Complete assigned projects on time with quality output.</li>
              <li>Contribute to team success and collaboration.</li>
              <li>Improve performance or efficiency.</li>
              <li>Learn and apply new technologies or tools.</li>
            </ul>

            <div className="mt-4 rounded-xl bg-[#F4F8FF] p-4">
              <p className="font-semibold text-[#0E4CB7]">Example</p>
              <p>Completed Project A before deadline and improved load time by 20%.</p>
              <p>Helped teammates resolve issues and ensured smooth delivery.</p>
            </div>
          </div>

          {/* Improvements */}
          <div className="card">
            <h2 className="section-header">
              Improvements (Areas to work on)
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Time management and task prioritization.</li>
              <li>Documentation and reporting.</li>
              <li>Code quality and standards.</li>
              <li>Learning new skills or tools.</li>
            </ul>

            <div className="mt-4 rounded-xl bg-[#F4F8FF] p-4">
              <p className="font-semibold text-[#0E4CB7]">Example</p>
              <p>Need to improve task estimation accuracy.</p>
              <p>Should focus more on maintainable code practices.</p>
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
              <li>Participation in company activities.</li>
              <li>Helping team members or mentoring juniors.</li>
              <li>Taking initiative beyond assigned work.</li>
              <li>Contributing to team culture or events.</li>
            </ul>
          </div>

        </div>

      ) : (

        <div className="overflow-hidden rounded-xl border border-[#D6E4FF] bg-white shadow-lg">

          {/* Header */}
          <div className="bg-[#0E4CB7] px-6 py-4 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Sample Self Evaluation
              </h2>
              <p className="text-sm text-blue-100">
                Annual Appraisal Cycle 2026
              </p>
            </div>

            <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
              Example Only
            </span>
          </div>

          {/* Employee Details */}
          <div className="grid gap-5 border-b p-6 md:grid-cols-3">

            <div>
              <p className="text-xs text-gray-500 uppercase">Employee</p>
              <p className="font-semibold">Alex Johnson</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase">Manager</p>
              <p className="font-semibold">Sarah Chen</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase">Department</p>
              <p className="font-semibold">Engineering</p>
            </div>

          </div>

          <div className="space-y-5 p-6">

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-[#0E4CB7] mb-3">
                Achievements
              </h3>

              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Successfully completed Employee Management System.</li>
                <li>Reduced API response time by 30%.</li>
                <li>Implemented JWT Authentication.</li>
                <li>Fixed 20+ critical bugs.</li>
              </ul>
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-[#0E4CB7] mb-3">
                Challenges
              </h3>

              <p className="text-gray-700">
                Faced challenges while integrating notifications and role-based
                authentication but resolved them through debugging and
                documentation.
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-[#0E4CB7] mb-3">
                Additional Comments
              </h3>

              <p className="text-gray-700">
                Completed all assigned work on time and consistently learned new
                backend technologies. Looking forward to improving system design
                skills in the next appraisal cycle.
              </p>
            </div>

            <div className="rounded-xl border bg-[#F4F8FF] p-5">
              <h3 className="font-semibold text-[#0E4CB7] mb-3">
                Self Rating
              </h3>

              <div className="flex items-center gap-3">

                <span className="text-3xl text-yellow-500">
                  ★★★★☆
                </span>

                <span className="text-xl font-bold">
                  4 / 5
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  Exceeds Expectations
                </span>

              </div>

              <p className="mt-3 text-gray-600">
                Rating based on successful project completion, continuous
                learning, and teamwork, while still having room to improve
                estimation and planning.
              </p>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex justify-between">

              <div>
                <p className="font-semibold text-green-700">
                  Status
                </p>

                <p className="text-green-600">
                  Submitted to Manager
                </p>
              </div>

              <div className="font-medium text-green-700">
                ✓ Locked — already submitted
              </div>

            </div>

          </div>

        </div>

      )}
    </div>
  );
}