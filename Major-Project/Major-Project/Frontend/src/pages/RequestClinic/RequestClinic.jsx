import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClinicRequest } from "../../services/clinicRequestService";

function RequestClinic() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clinicName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    services: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
   * Module dependency configuration
   *
   * These dependencies are also enforced by the backend.
   * Keeping the same structure here makes the selection process
   * clear to the clinic administrator.
   */
  const moduleDependencies = {
    "Patient Management": [],
    "Staff Management": [],

    "Appointment Scheduling": [
      "Patient Management",
      "Staff Management",
    ],

    "Token Management": [
      "Patient Management",
      "Staff Management",
    ],

    "Reports & Analytics": [],
  };

  const services = [
    "Patient Management",
    "Appointment Scheduling",
    "Token Management",
    "Staff Management",
    "Reports & Analytics",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const alreadySelected = prev.services.includes(service);

      /*
       * If the service is already selected:
       * remove it only if it is not required by another
       * currently selected service.
       */
      if (alreadySelected) {
        const otherSelectedServices = prev.services.filter(
          (item) => item !== service
        );

        const stillRequired = otherSelectedServices.some((item) =>
          moduleDependencies[item]?.includes(service)
        );

        if (stillRequired) {
          return prev;
        }

        return {
          ...prev,
          services: otherSelectedServices,
        };
      }

      /*
       * Add the selected service.
       */
      const updatedServices = [...prev.services, service];

      /*
       * Automatically add all required dependencies.
       */
      const addDependencies = (moduleName) => {
        const dependencies = moduleDependencies[moduleName] || [];

        dependencies.forEach((dependency) => {
          if (!updatedServices.includes(dependency)) {
            updatedServices.push(dependency);
            addDependencies(dependency);
          }
        });
      };

      addDependencies(service);

      return {
        ...prev,
        services: updatedServices,
      };
    });
  };

  /*
   * Returns the modules that were automatically included
   * because of another selected module.
   */
  const getAutoIncludedModules = () => {
    const autoIncluded = new Set();

    formData.services.forEach((service) => {
      const dependencies = moduleDependencies[service] || [];

      dependencies.forEach((dependency) => {
        if (formData.services.includes(dependency)) {
          autoIncluded.add(dependency);
        }
      });
    });

    return Array.from(autoIncluded);
  };

  const autoIncludedModules = getAutoIncludedModules();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    if (formData.services.length === 0) {
      setError("Please select at least one service.");
      setLoading(false);
      return;
    }

    try {
      await createClinicRequest(formData);

      setMessage(
        "Clinic request submitted successfully. Our team will review your request."
      );

      setFormData({
        clinicName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        services: [],
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="bg-[#023859] text-white px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="text-gray-300 hover:text-white transition mb-5"
          >
            ← Back to Home
          </button>

          <h1 className="text-4xl font-bold">
            Request a Clinic Workspace
          </h1>

          <p className="mt-3 text-gray-300">
            Submit your clinic details and select the services you need.
          </p>
        </div>
      </div>

      {/* Form */}

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10">
          {/* Success Message */}

          {message && (
            <div className="mb-6 rounded-xl bg-green-100 border border-green-300 text-green-700 px-5 py-4">
              {message}
            </div>
          )}

          {/* Error Message */}

          {error && (
            <div className="mb-6 rounded-xl bg-red-100 border border-red-300 text-red-700 px-5 py-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Clinic Details */}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Clinic Name */}

              <div>
                <label className="block text-sm font-semibold text-[#023859] mb-2">
                  Clinic Name
                </label>

                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  placeholder="Enter clinic name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Owner Name */}

              <div>
                <label className="block text-sm font-semibold text-[#023859] mb-2">
                  Owner / Doctor Name
                </label>

                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Email */}

              <div>
                <label className="block text-sm font-semibold text-[#023859] mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="block text-sm font-semibold text-[#023859] mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* City */}

              <div>
                <label className="block text-sm font-semibold text-[#023859] mb-2">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Address */}

              <div>
                <label className="block text-sm font-semibold text-[#023859] mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter clinic address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>
            </div>

            {/* Services */}

            <div className="mt-10">
              <h2 className="text-xl font-bold text-[#023859]">
                Select Services
              </h2>

              <p className="text-gray-500 mt-1 mb-5">
                Choose the services your clinic requires. Some services
                automatically include the modules they depend on.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const isSelected = formData.services.includes(service);

                  const requiredBy = services.filter(
                    (otherService) =>
                      otherService !== service &&
                      formData.services.includes(otherService) &&
                      moduleDependencies[otherService]?.includes(service)
                  );

                  const isAutomaticallyIncluded = requiredBy.length > 0;

                  return (
                    <label
                      key={service}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition ${
                        isSelected
                          ? "border-[#54ACBF] bg-[#54ACBF]/10"
                          : "border-gray-300 hover:border-[#54ACBF]"
                      } ${
                        isAutomaticallyIncluded
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isAutomaticallyIncluded}
                        onChange={() => handleServiceChange(service)}
                        className="w-5 h-5 mt-0.5 accent-[#54ACBF]"
                      />

                      <div>
                        <span className="font-medium text-gray-700 block">
                          {service}
                        </span>

                        {moduleDependencies[service]?.length > 0 && (
                          <span className="text-xs text-gray-500 block mt-1">
                            Requires{" "}
                            {moduleDependencies[service].join(" + ")}
                          </span>
                        )}

                        {isAutomaticallyIncluded && (
                          <span className="text-xs text-[#26658C] font-medium block mt-1">
                            Automatically included because{" "}
                            {requiredBy.join(", ")} is selected.
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Dependency Information */}

              {autoIncludedModules.length > 0 && (
                <div className="mt-5 rounded-xl bg-blue-50 border border-blue-200 px-5 py-4">
                  <p className="text-sm font-semibold text-[#023859]">
                    Required modules have been included automatically.
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {autoIncludedModules.join(", ")}{" "}
                    {autoIncludedModules.length === 1
                      ? "is"
                      : "are"}{" "}
                    required by another selected service.
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-[#54ACBF] text-white py-3.5 rounded-xl font-semibold hover:bg-[#26658C] transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Clinic Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestClinic;