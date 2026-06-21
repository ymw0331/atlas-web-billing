import React from "react";
import NextLink from "next/link";
import { Alert, Card, CardBody, CardHeader, Button, Link, cn } from "@heroui/react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-96 flex items-center justify-center"
        style={{
          backgroundImage: 'url("/images/hero.svg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Atlas
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Internal operations platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="max-w-6xl mx-auto">
          <Alert
            classNames={{
              base: cn(
                [
                  "bg-default-50 dark:bg-background shadow-sm",
                  "border-1 border-default-200 dark:border-default-100",
                  "relative before:content-[''] before:absolute before:z-10",
                  "before:left-0 before:top-[-1px] before:bottom-[-1px] before:w-1",
                  "rounded-l-none border-l-0",
                  "before:bg-primary",
                ],
              ),
              mainWrapper: cn("pt-1"),
              iconWrapper: cn("dark:bg-transparent"),
            }}
            color="default"
            title="This is a demonstration application showcasing different user experiences
              and workflows. For any feedback, questions, or suggestions, please contact:"
          >
            <div className="flex items-center gap-1 mt-3">
              <Button
                className="bg-background text-default-700 font-medium border-1 shadow-small"
                variant="bordered"
              >
                <Link href="mailto:support@atlas.com" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  support@atlas.com
                </Link>
              </Button>
            </div>
          </Alert>
        </div>
      </div>

      <div id="external-users" className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8 space-y-8">

          {/* External User Section */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">External Users</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                A seamless and secure platform offering real-time access to Singapore&apos;s capital markets for global investors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">Members</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Access member-specific features and services.
                  </p>
                  <Button as={NextLink} href="/members" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter as Member
                  </Button>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">Issuers</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Manage your listings and issuer services.
                  </p>
                  <Button as={NextLink} href="/issuers" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter as Issuer
                  </Button>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">Investors</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Explore investment opportunities and market data.
                  </p>
                  <Button as={NextLink} href="/investors" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter as Investor
                  </Button>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">Data Vendors</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Access market data feeds, APIs, and analytics tools.
                  </p>
                  <Button as={NextLink} href="/data-vendors" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter as Data Vendor
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div id="executive-view" className="container mx-auto px-6 py-8 space-y-8">

        {/* Executive View Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Executive View</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A strategic dashboard offering ATLAS executives real-time insights into market performance, operational metrics, and risk exposure for informed decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <h3 className="text-xl font-semibold">Market Today</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  Real-time market overview with securities and derivatives performance.
                </p>
                <Button as={NextLink} href="/executive/market-today" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                  View Market Today
                </Button>
              </CardBody>
            </Card>

            <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <h3 className="text-xl font-semibold">Securities</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  Securities market overview and trading performance metrics.
                </p>
                <Button as={NextLink} href="/executive/securities" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                  View Securities
                </Button>
              </CardBody>
            </Card>

            <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <h3 className="text-xl font-semibold">Derivatives</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  Derivatives market insights and risk analytics dashboard.
                </p>
                <Button as={NextLink} href="/executive/derivatives" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                  View Derivatives
                </Button>
              </CardBody>
            </Card>

            <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <h3 className="text-xl font-semibold">Customer 360</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  Comprehensive customer insights and relationship analytics.
                </p>
                <Button as={NextLink} href="/executive/customer360" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                  View Customer 360
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8 space-y-8">

          {/* Internal User Section */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Internal Users</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                An integrated and efficient workspace enabling ATLAS staff to manage operations, compliance, and market activities with speed and precision.
              </p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">Technology</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Technology management and infrastructure tools.
                  </p>
                  <Button as={NextLink} href="/technology" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter Technology
                  </Button>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">Securities Operation</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Securities market operations and workflow management.
                  </p>
                  <Button as={NextLink} href="/operation/securities" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter Securities Ops
                  </Button>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">Derivatives Operation</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Derivatives market operations and workflow management.
                  </p>
                  <Button as={NextLink} href="/operation/derivatives" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter Derivatives Ops
                  </Button>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">Risk</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Risk management and compliance monitoring.
                  </p>
                  <Button as={NextLink} href="/risk" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter Risk
                  </Button>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
                <CardHeader className="pb-0 pt-6 px-6">
                  <h3 className="text-xl font-semibold">RegCo</h3>
                </CardHeader>
                <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    Regulatory compliance and oversight tools.
                  </p>
                  <Button as={NextLink} href="/regco" color="primary" variant="bordered" className="w-full mt-auto hover:bg-primary hover:text-white">
                    Enter RegCo
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Data Entry Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Data Entry</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Add new entities to the system using dynamic forms based on OpenAPI schemas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <h3 className="text-xl font-semibold">Add Company</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  Register a new company with comprehensive business information.
                </p>
                <Button as={NextLink} href="/add-company" color="success" variant="bordered" className="w-full mt-auto hover:bg-success hover:text-white">
                  Add Company
                </Button>
              </CardBody>
            </Card>

            <Card className="hover:shadow-lg transition-shadow flex flex-col" shadow="sm">
              <CardHeader className="pb-0 pt-6 px-6">
                <h3 className="text-xl font-semibold">Add Person</h3>
              </CardHeader>
              <CardBody className="px-6 pb-6 flex flex-col flex-grow">
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  Register a new person with detailed profile information.
                </p>
                <Button as={NextLink} href="/add-person" color="success" variant="bordered" className="w-full mt-auto hover:bg-success hover:text-white">
                  Add Person
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
