console.log("in JS file");

import * as dbrBundle from "dynamsoft-barcode-reader-bundle";
const {
  CoreModule,
  LicenseManager,
  CaptureVisionRouter,
  CameraView,
  CameraEnhancer,
  MultiFrameResultCrossFilter,
  EnumBarcodeFormat,
} = dbrBundle;

import * as codeParserLibrary from "dynamsoft-code-parser";
const { CodeParser, CodeParserModule } = codeParserLibrary;

export async function loadDynamsoftSDK() {
  try {
    LicenseManager.initLicense("");

    CoreModule.engineResourcePaths = {
      std: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-std@1.2.10/dist/",
      dip: "https://cdn.jsdelivr.net/npm/dynamsoft-image-processing@2.2.30/dist/",
      core: "https://cdn.jsdelivr.net/npm/dynamsoft-core@3.2.30/dist/",
      license: "https://cdn.jsdelivr.net/npm/dynamsoft-license@3.2.21/dist/",
      cvr: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.2.30/dist/",
      dbr: "https://cdn.jsdelivr.net/npm/dynamsoft-barcode-reader@10.2.10/dist/",
      dce: "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@4.0.3/dist/",
    };

    CoreModule.loadWasm(["DBR", "DCP"]);
    CodeParserModule.loadSpec("AAMVA_DL_ID");
    CodeParserModule.loadSpec("AAMVA_DL_ID_WITH_MAG_STRIPE");

    console.log("Success");
  } catch (error) {
    console.error("Failed to load Dynamsoft SDK:", error);
    throw error;
  }
}

function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

export async function startDlScan() {
  const scanningModalId = "camera-view-container";
  const scanningModalWindow = document.getElementById("camera-view-container");
  const cameraViewContainer = scanningModalWindow;

  // Create the main container div
  const enhancerUIContainer = document.createElement("div");
  enhancerUIContainer.id = "enhancerUIContainer";
  enhancerUIContainer.style.width = "100%";
  enhancerUIContainer.style.height = "60vh";
  enhancerUIContainer.style.maxHeight = "50vh";
  enhancerUIContainer.style.background = "#ddd";

  // Create the video container div
  const videoContainer = document.createElement("div");
  videoContainer.className = "dce-video-container";
  videoContainer.style.width = "100%";
  videoContainer.style.height = "50%";
  videoContainer.style.maxHeight = "50vh"; // Limit height to half of the viewport height
  videoContainer.style.objectFit = "cover"; // Ensure video covers the designated space

  // Append the video container to the main container
  enhancerUIContainer.appendChild(videoContainer);

  // Append the main container to the body or another element on the page
  scanningModalWindow.appendChild(enhancerUIContainer);

  openModal(scanningModalId);

  const cameraView = await CameraView.createInstance(enhancerUIContainer);
  const cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
  cameraViewContainer.append(cameraView.getUIElement());

  const cvRouter = await CaptureVisionRouter.createInstance();
  cvRouter.setInput(cameraEnhancer);

  const filter = new MultiFrameResultCrossFilter();
  filter.enableResultDeduplication("barcode", true);
  await cvRouter.addResultFilter(filter);

  cvRouter.addResultReceiver({
    onDecodedBarcodesReceived: async (result) => {
      if (!result.barcodeResultItems.length) return;

      const parser = await CodeParser.createInstance();
      try {
        let parsedDLInfo = await parser.parse(result.barcodeResultItems[0].bytes);
        if (parsedDLInfo.exception) return false;
        parsedDLInfo = JSON.parse(parsedDLInfo.jsonString);
        let oriParseInfo = {};

        if (parsedDLInfo.CodeType === "AAMVA_DL_ID") {
          for (let info of parsedDLInfo.ResultInfo) {
            if (info.FieldName !== "commonSubfile") continue;
            if (info.ChildFields) {
              wrapResultObject(info.ChildFields, oriParseInfo);
            }
          }
        } else if (parsedDLInfo.CodeType === "AAMVA_DL_ID_WITH_MAG_STRIPE") {
          for (let info of parsedDLInfo.ResultInfo) {
            if (info.FieldName.includes("track")) {
              if (info.ChildFields) {
                wrapResultObject(info.ChildFields, oriParseInfo);
              }
            }
          }
        }

        console.log(oriParseInfo);

        const dob = oriParseInfo.birthDate;
        const formattedDate = `${dob.slice(0, 2)}/${dob.slice(2, 4)}/${dob.slice(4)}`;
        const gender = () => {
          switch (oriParseInfo.sex) {
            case "male":
              return "Male";
            case "female":
              return "Female";
            default:
              return "Unknown";
          }
        };
        const state = () => {
          switch (oriParseInfo.jurisdictionCode) {
            case "Alabama":
              return "AL";
            case "Alaska":
              return "AK";
            case "Arizona":
              return "AZ";
            case "Arkansas":
              return "AR";
            case "California":
              return "CA";
            case "Colorado":
              return "CO";
            case "Connecticut":
              return "CT";
            case "Delaware":
              return "DE";
            case "Florida":
              return "FL";
            case "Georgia":
              return "GA";
            case "Hawaii":
              return "HI";
            case "Idaho":
              return "ID";
            case "Illinois":
              return "IL";
            case "Indiana":
              return "IN";
            case "Iowa":
              return "IA";
            case "Kansas":
              return "KS";
            case "Kentucky":
              return "KY";
            case "Louisiana":
              return "LA";
            case "Maine":
              return "ME";
            case "Maryland":
              return "MD";
            case "Massachusetts":
              return "MA";
            case "Michigan":
              return "MI";
            case "Minnesota":
              return "MN";
            case "Mississippi":
              return "MS";
            case "Missouri":
              return "MO";
            case "Montana":
              return "MT";
            case "Nebraska":
              return "NE";
            case "Nevada":
              return "NV";
            case "New Hampshire":
              return "NH";
            case "New Jersey":
              return "NJ";
            case "New Mexico":
              return "NM";
            case "New York":
              return "NY";
            case "North Carolina":
              return "NC";
            case "North Dakota":
              return "ND";
            case "Ohio":
              return "OH";
            case "Oklahoma":
              return "OK";
            case "Oregon":
              return "OR";
            case "Pennsylvania":
              return "PA";
            case "Rhode Island":
              return "RI";
            case "South Carolina":
              return "SC";
            case "South Dakota":
              return "SD";
            case "Tennessee":
              return "TN";
            case "Texas":
              return "TX";
            case "Utah":
              return "UT";
            case "Vermont":
              return "VT";
            case "Virginia":
              return "VA";
            case "Washington":
              return "WA";
            case "West Virginia":
              return "WV";
            case "Wisconsin":
              return "WI";
            case "Wyoming":
              return "WY";
            default:
              return "Unknown";
          }
        };

        document.getElementById("guestfname").value = oriParseInfo.firstName;
        document.getElementById("guestlname").value = oriParseInfo.lastName;
        document.getElementById("dobWaiver").value = formattedDate;
        document.getElementById("genderWaiver").value = gender();

        document.getElementById("firstName").value = oriParseInfo.firstName;
        document.getElementById("lastName").value = oriParseInfo.lastName;
        document.getElementById("state").value = state();
        document.getElementById("addressLine1").value = oriParseInfo.street_1;
        document.getElementById("city").value = oriParseInfo.city;
        document.getElementById("zipCode").value = oriParseInfo.postalCode;
        document.getElementById("birthday").value = formattedDate;
        document.getElementById("gender").value = gender();

        cvRouter.stopCapturing();
        cameraEnhancer.close();
        closeModal(scanningModalId);
        return true;
      } catch (ex) {
        alert(ex.message);
        return false;
      }
    },
  });

  let settings = await cvRouter.getSimplifiedSettings("ReadDenseBarcodes");
  settings.barcodeSettings.barcodeFormatIds = EnumBarcodeFormat.BF_PDF417;
  await cvRouter.updateSettings("ReadDenseBarcodes", settings);
  cameraEnhancer.singleFrameMode = "image";

  await cameraEnhancer.open();
  await cvRouter.startCapturing("ReadDenseBarcodes");

  document.getElementById("okaymodalBtn15").onclick = async () => {
    cvRouter.stopCapturing();
    cameraEnhancer.close();
    closeModal(scanningModalId);
  };
  document.getElementById("startBtn15").onclick = async () => {
    openModal(scanningModalId);
    await startDlScan();
  };

  function wrapResultObject(childFields, oriParseInfo) {
    for (let childField of childFields) {
      for (let field of childField) {
        if (!["dataElementSeparator", "segmentTerminator", "subfile", "subfileType"].includes(field.FieldName)) {
          oriParseInfo[field.FieldName] = field.Value;
        }
        if (field.ChildFields) {
          wrapResultObject(field.ChildFields, oriParseInfo);
        }
      }
    }
  }
}

loadDynamsoftSDK();
startDlScan();
