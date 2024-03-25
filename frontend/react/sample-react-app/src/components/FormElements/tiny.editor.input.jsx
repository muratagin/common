import { Editor } from "@tinymce/tinymce-react";
import { useEffect } from "react";
import Resizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      "JPEG",
      70,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

function TinyEditor({ data, onChange, onFocus, onBlur, refElement }) {
  useEffect(() => {
    if (document.getElementsByClassName("modal").length > 0) {
      document.getElementsByClassName("modal")[0].removeAttribute("tabindex");
    }
  }, []);
  return (
    <div>
      <Editor
        onFocus={onFocus}
        onBlur={onBlur}
        data={data}
        onInit={(evt, editor) => (refElement.current = editor)}
        value={data}
        init={{
          height: 250,
          language: "tr",
          automatic_uploads: true,
          file_picker_types: "image",
          file_picker_callback: function (cb, value, meta) {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            input.onchange = async function () {
              const file = await resizeFile(this.files[0]);
              var reader = new FileReader();
              reader.onload = function () {
                var id = "blobid" + new Date().getTime();
                var blobCache =
                  window.tinymce.activeEditor.editorUpload.blobCache;
                var base64 = reader.result.split(",")[1];
                var blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };
            input.click();
          },
          menubar: false,
          plugins: "lists code emoticons, link,image media,paste",
          paste_as_text: true,
          toolbar: [
            "paragraph | bold | strikethrough | italic | numlist | bullist | RemoveFormat | emoticons| link | image | blockquote ",
          ],
          toolbar_location: "top",
          elementpath: false,
          //menubar:false,
          statusbar: false,
          content_style:
            "body { font-family: Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif; font-size:14px }",
        }}
        onEditorChange={(newValue, editor) => onChange(newValue)}
      />
    </div>
  );
}

export default TinyEditor;
