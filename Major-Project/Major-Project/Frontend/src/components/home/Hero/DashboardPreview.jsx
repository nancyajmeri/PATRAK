import {
  Users,
  CalendarDays,
  UserRound,
  BriefcaseMedical,
} from "lucide-react";

function DashboardPreview() {
  return (
    <div className="flex justify-center items-center">

      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-[#F8FCFD] shadow-xl overflow-hidden">

        {/* Header */}

        <div className="bg-[#023859] text-white px-6 py-5">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-xl font-bold">
                PATRAK
              </h2>

              <p className="text-sm opacity-80">
                Clinic Dashboard
              </p>

            </div>

            {/* Window Buttons */}

            <div className="flex gap-2">

              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-2 gap-4 p-6">

          <div className="rounded-2xl bg-[#F8FAFC] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">

            <Users className="text-[#54ACBF]" size={24} />

            <p className="text-sm text-gray-500 mt-2">
              Patients
            </p>

            <h3 className="text-2xl font-bold text-[#023859]">
              245
            </h3>

          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">

            <CalendarDays className="text-[#54ACBF]" size={24} />

            <p className="text-sm text-gray-500 mt-2">
              Appointments
            </p>

            <h3 className="text-2xl font-bold text-[#023859]">
              34
            </h3>

          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">

            <UserRound className="text-[#54ACBF]" size={24} />

            <p className="text-sm text-gray-500 mt-2">
              Doctors
            </p>

            <h3 className="text-2xl font-bold text-[#023859]">
              12
            </h3>

          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">

            <BriefcaseMedical className="text-[#54ACBF]" size={24} />

            <p className="text-sm text-gray-500 mt-2">
              Staff
            </p>

            <h3 className="text-2xl font-bold text-[#023859]">
              8
            </h3>

          </div>

        </div>

        {/* Queue */}

        <div className="px-6 pt-2 pb-4">

          <div className="flex justify-between text-sm mb-2">

            <span className="font-medium text-[#023859]">
              Today's Queue
            </span>

            <span className="text-gray-500">
              18 Patients Waiting
            </span>

          </div>

          <div className="w-full h-3 rounded-full bg-gray-200">

            <div className="w-3/4 h-3 rounded-full bg-[#54ACBF]"></div>

          </div>

        </div>

        {/* Recent Activity */}

        <div className="px-6 pb-6">

          <h4 className="font-semibold text-[#023859] mb-3">
            Recent Activity
          </h4>

          <div className="space-y-3 text-sm text-gray-600">

            <div className="flex items-center gap-2">

              <div className="w-2 h-2 rounded-full bg-green-500"></div>

              <p>Token #21 Generated</p>

            </div>

            <div className="flex items-center gap-2">

              <div className="w-2 h-2 rounded-full bg-blue-500"></div>

              <p>New Patient Registered</p>

            </div>

            <div className="flex items-center gap-2">

              <div className="w-2 h-2 rounded-full bg-[#54ACBF]"></div>

              <p>Appointment Confirmed</p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardPreview;