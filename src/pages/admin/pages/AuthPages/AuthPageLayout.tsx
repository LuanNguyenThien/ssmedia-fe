import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router-dom";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div
          className="items-center hidden w-full h-full lg:w-1/2 dark:bg-white/5 lg:grid"
          style={{ backgroundColor: "#161950" }}
        >
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            {/* <GridShape /> */}

            <div className="flex flex-col items-center max-w-sm text-center">
              <Link to="/" className="block mb-4">
                <div className="flex items-center space-x-2">
                  <img src="/logo.svg" alt="Logo" width={40} height={40} />
                  <span className="text-white text-xl font-semibold">
                    BrainetAdmin
                  </span>
                </div>
              </Link>

              <p className="text-gray-400 dark:text-white/60">
                A place to manage and track your website’s data.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
