"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* HEADER */}

      <div className="w-full bg-white shadow flex items-center justify-between px-6 py-3">

        <img src="/PES University Logo Horizontal.png" className="h-12"/>

        <div className="text-center">
          <h1 className="text-lg font-semibold">
            PESU CIE Certificate Verification
          </h1>
          <p className="text-xs text-gray-500">
            Blockchain Credential Registry
          </p>
        </div>

        <img src="/CIE Logo.png" className="h-12"/>

      </div>


      {/* MAIN CARD */}

      <div className="bg-white shadow-xl rounded-lg mt-10 p-8 w-[720px]">

        <h2 className="text-xl font-semibold text-center mb-6">
          Blockchain Credential Verification
        </h2>


        {/* TRANSACTION HASH */}

        <div className="mb-6">

          <p className="text-sm text-gray-500 mb-1">
            Transaction Hash
          </p>

          <p className="break-all text-xs bg-gray-100 p-3 rounded">
            {txHash}
          </p>

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

            <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded mb-6 text-center">

              <div className="text-xl font-semibold">
                ✔ Verified Blockchain Credential
              </div>

              <p className="text-sm mt-1">
                This credential has been cryptographically verified on the Polygon blockchain.
              </p>

              <p className="text-sm mt-1">
                Issued by PES University — Centre for Innovation and Entrepreneurship (CIE).
              </p>

            </div>


            <div className="border rounded-lg overflow-hidden mb-6">

              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium">
                Credential Details
              </div>

              <div className="grid grid-cols-2 text-sm">

                <div className="bg-gray-50 p-3 border">Student Name</div>
                <div className="p-3 border font-medium">{studentName}</div>

                <div className="bg-gray-50 p-3 border">Achievement</div>
                <div className="p-3 border font-medium">{achievement}</div>

                <div className="bg-gray-50 p-3 border">Team</div>
                <div className="p-3 border">{team}</div>

                <div className="bg-gray-50 p-3 border">Issue Date</div>
                <div className="p-3 border">{date}</div>

                <div className="bg-gray-50 p-3 border">Issued By</div>
                <div className="p-3 border">{issuedBy}</div>

              </div>

            </div>


            {project !== "—" && (
              <div className="mb-6">

                <h4 className="font-semibold text-gray-700 mb-2">
                  Project Description
                </h4>

                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded">
                  {project}
                </p>

              </div>
            )}


            <div className="border rounded-lg p-4 bg-gray-50 text-sm mb-6">

              <h4 className="font-semibold text-gray-700 mb-2">
                Blockchain Record
              </h4>

              <p>Network: Polygon Blockchain Mainnet</p>
              <p>Block Number: <b>{result.blockNumber}</b></p>
              <p>Gas Used: <b>{result.gasUsed}</b></p>

            </div>


            <div className="text-center">

              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                View on PolygonScan
              </a>

            </div>

          </div>
        )}


        {result && !result.valid && (

          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded mb-6 text-center">

            <div className="text-3xl mb-2">✗ Invalid Certificate</div>

            <h3 className="text-lg font-semibold">
              PESU Centre for Innovation and Entrepreneurship (CIE) is unable to verify this Digital Certificate.
            </h3>

            <p className="text-gray-600 text-sm mt-2">
              {result.reason}
            </p>

          </div>

        )}

      </div>


      <div className="text-center text-xs text-gray-500 mt-8">

        <p>Powered by the Polygon Blockchain</p>
        <p className="mt-1">
          PES Univerity - Centre for Innovation and Entrepreneurship
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
    <Suspense fallback={<div className="p-10 text-center">Loading verification...</div>}>
      <VerifyContent />
    </Suspense>
  );

}