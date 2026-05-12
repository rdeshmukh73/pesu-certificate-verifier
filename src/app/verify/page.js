"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { verifyTransaction } from "../../lib/verifyTx";

function VerifyContent() {

  const searchParams = useSearchParams();
  const txHash = searchParams.get("tx");

  const [result, setResult] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {

    async function runVerification() {

      if (!txHash) return;

      const res = await verifyTransaction(txHash);

      setResult(res);

      if (res?.ipfsURI) {

        try {

          const metadataURL =
            res.ipfsURI.replace(
              "ipfs://",
              "https://gateway.pinata.cloud/ipfs/"
            );

          console.log("Metadata URL:", metadataURL);

          const data = await fetch(metadataURL).then(r => r.json());

          console.log("Metadata:", data);

          setMetadata(data);

        } catch (err) {

          console.error("Metadata fetch error", err);

        }

      }

    }

    runVerification();

  }, [txHash]);


  const attrs = metadata?.attributes || [];

  const getAttr = (name) =>
    attrs.find(a => a.trait_type === name)?.value || "—";

  const studentName = getAttr("Student Name");
  const achievement = getAttr("Achievement");
  const team = getAttr("Team Name");
  const project = getAttr("Project Description");
  const date = getAttr("Date");
  const issuedBy = getAttr("Issued By");


  return (

    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-3 sm:px-4 py-4">

      {/* HEADER */}

      <div className="w-full bg-white shadow-md rounded-xl flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 gap-4">

        <div className="flex justify-center sm:justify-start w-full sm:w-auto">
          <Image
            src="/PES University Logo Horizontal.png"
            alt="PES University"
            width={180}
            height={50}
            className="h-10 sm:h-12 w-auto"
          />
        </div>

        <div className="text-center">
          <h1 className="text-base sm:text-lg font-semibold">
            PESU CIE Certificate Verification
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            Blockchain Credential Registry
          </p>
        </div>

        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <Image
            src="/CIE Logo.png"
            alt="CIE Logo"
            width={60}
            height={60}
            className="h-10 sm:h-12 w-auto"
          />
        </div>

      </div>


      {/* MAIN CARD */}

      <div className="bg-white shadow-xl rounded-xl mt-6 sm:mt-10 p-4 sm:p-8 w-full max-w-[720px]">

        <h2 className="text-lg sm:text-xl font-semibold text-center mb-6">
          Blockchain Credential Verification
        </h2>


        {/* TRANSACTION HASH */}

        <div className="mb-6">

          <p className="text-sm text-gray-500 mb-2">
            Transaction Hash
          </p>

          <div className="bg-gray-100 p-3 rounded overflow-x-auto">

            <p className="break-all text-xs sm:text-sm">
              {txHash}
            </p>

          </div>

        </div>


        {!result && (

          <div className="text-center mt-6">

            <p className="text-blue-600 font-medium">
              Verifying certificate on blockchain...
            </p>

          </div>

        )}


        {result && result.valid && (

          <div className="mt-6">

            {/* SUCCESS BOX */}

            <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg mb-6 text-center">

              <div className="text-lg sm:text-xl font-semibold">
                ✔ Verified Blockchain Credential
              </div>

              <p className="text-sm mt-2">
                This credential has been cryptographically verified on the Polygon blockchain.
              </p>

              <p className="text-sm mt-1">
                Issued by PES University — Centre for Innovation and Entrepreneurship (CIE).
              </p>

            </div>


            {/* CREDENTIAL DETAILS */}

            <div className="border rounded-lg shadow-sm overflow-hidden mb-6">

              <div className="bg-gray-800 text-white px-4 py-3 text-sm font-medium">
                Credential Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 text-sm">

                <div className="bg-slate-100 p-3 border font-semibold text-slate-700 text-sm">
                  Student Name
                </div>

                <div className="p-3 border text-gray-900 break-words">
                  {studentName}
                </div>


                <div className="bg-slate-100 p-3 border font-semibold text-slate-700 text-sm">
                  Achievement
                </div>

                <div className="p-3 border break-words">
                  {achievement}
                </div>


                <div className="bg-slate-100 p-3 border font-semibold text-slate-700 text-sm">
                  Team
                </div>

                <div className="p-3 border break-words">
                  {team}
                </div>


                <div className="bg-slate-100 p-3 border font-semibold text-slate-700 text-sm">
                  Issue Date
                </div>

                <div className="p-3 border">
                  {date}
                </div>


                <div className="bg-slate-100 p-3 border font-semibold text-slate-700 text-sm">
                  Issued By
                </div>

                <div className="p-3 border break-words">
                  {issuedBy}
                </div>

              </div>

            </div>


            {/* PROJECT DESCRIPTION */}

            {project !== "—" && (

              <div className="mb-6">

                <h4 className="font-semibold text-gray-700 mb-2">
                  Project Description
                </h4>

                <div className="bg-gray-50 p-4 rounded-lg border">

                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {project}
                  </p>

                </div>

              </div>

            )}


            {/* BLOCKCHAIN DETAILS */}

            <div className="border rounded-lg p-4 bg-gray-50 text-sm mb-6">

              <h4 className="font-semibold text-gray-700 mb-3">
                Blockchain Record
              </h4>

              <div className="space-y-2">

                <p>
                  Network:
                  <span className="font-medium ml-1">
                    Polygon Blockchain Mainnet
                  </span>
                </p>

                <p>
                  Block Number:
                  <span className="font-medium ml-1">
                    {result.blockNumber}
                  </span>
                </p>

                <p>
                  Gas Used:
                  <span className="font-medium ml-1">
                    {result.gasUsed}
                  </span>
                </p>

              </div>

            </div>


            {/* BUTTON */}

            <div className="text-center">

              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                View on PolygonScan
              </a>

            </div>

          </div>

        )}


        {/* INVALID CERTIFICATE */}

        {result && !result.valid && (

          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg mb-6 text-center">

            <div className="text-2xl sm:text-3xl mb-2">
              ✗ Invalid Certificate
            </div>

            <h3 className="text-base sm:text-lg font-semibold">
              PESU Centre for Innovation and Entrepreneurship (CIE) is unable to verify this Digital Certificate.
            </h3>

            <p className="text-gray-700 text-sm mt-3 break-words">
              {result.reason}
            </p>

          </div>

        )}

      </div>


      {/* FOOTER */}

      <div className="text-center text-xs text-gray-500 mt-8 px-4">

        <p>Powered by the Polygon Blockchain</p>

        <p className="mt-1">
          PES University - Centre for Innovation and Entrepreneurship
        </p>

        <p className="mt-1">
          Immutable Academic Credential Registry
        </p>

      </div>

    </div>

  );

}


export default function VerifyPage() {

  return (

    <Suspense
      fallback={
        <div className="p-10 text-center">
          Loading verification...
        </div>
      }
    >

      <VerifyContent />

    </Suspense>

  );

}