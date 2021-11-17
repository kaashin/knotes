import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Button, Input, Textarea, Select, Box } from "@chakra-ui/react";
import { getTodayPage } from "@/utils/queries";
import axios from "axios";
import ContentEditable from "react-contenteditable";

const tempDbArr = [
  { dbId: "eae70b5fad3446c88ab4b8975d84d766", name: "General" },
  { dbId: "e671ca2678b94120aa949d12d5c7db29", name: "Kaashin" },
];
export default function NoteInputForm(props) {
  const {
    handleSubmit,
    watch,
    errors,
    control,
    getValues,
    setValue,
    register,
    setError,
    reset,
    clearErrors,
  } = useForm({
    defaultValues: {
      note: "",
      categoryId: tempDbArr[0].dbId,
    },
  });
  const noteRef = useRef("");
  const [noteHtml, setNoteHtml] = useState("Hello World");
  const queryClient = useQueryClient();

  const tempDbId = "";

  // ===========================================================================
  // Queries
  // ===========================================================================
  const {
    isLoading: todayPageIdLoading,
    dataUpdatedAt: todatePageIdUpdatedAt,
    isError,
    refetch: refetchTodayPageId,
    data: todayPageId,
    error,
    status,
  } = useQuery(["todayPageId", getValues("categoryId")], getTodayPage, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // ===========================================================================
  // Mutations
  // ===========================================================================
  const noteMutation = useMutation(
    async (data) => {
      // Get the pageId of the current day logs. This will create if there isn't one.
      // const todayPageId = await axios.get("/api/notion?action=getToday?dbId=");
      // const { pageId } = todayPageId.data.payload;

      // const { note } = data;

      let note = noteHtml;

      // Patch the daily log with a new note.
      const response = await axios.patch("/api/notion-page", {
        payload: {
          note,
          pageId: todayPageId.pageId,
        },
      });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        // queryClient.invalidateQueries("todos");

        // Clear the form
        // document.getElementById("noteInput").value = "";
        // setValue("note", "");
        setNoteHtml("");
      },
    }
  );

  // ===========================================================================
  // Function
  // ==========================================================================
  async function onSubmit(data) {
    // console.log(e.currentTarget);
    // const formData = new FormData(e.currentTarget);
    // const fieldValues = Object.fromEntries(formData.entries());
    // const { note } = fieldValues;
    noteMutation.mutate(data);
    // Reset fields
  }
  function handleNoteChange(e) {
    console.log(e.target.value);
    setNoteHtml(e.target.value);
  }

  // ===========================================================================
  // UseEffect
  // ==========================================================================
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      console.log(e);
      if (e.ctrlKey && e.keyCode === 80) {
        console.log("open project selection");

        e.preventDefault();
      }
    });
  });

  // ===========================================================================
  // Render
  // ==========================================================================

  return (
    <>
      <style jsx>{``}</style>

      <div>
        <form onSubmit={handleSubmit(onSubmit)} id="inputForm">
          <div>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    id="projectSelect"
                    placeholder="Select option"
                    onChange={(val) => {
                      field.onChange(val);
                      console.log("this has changedd");
                      refetchTodayPageId();
                    }}
                    value={field.value}
                  >
                    {tempDbArr.map((obj, index) => {
                      return (
                        <option value={obj.dbId} key={`category-${index}`}>
                          {obj.name}
                        </option>
                      );
                    })}
                  </Select>
                );
              }}
            />
          </div>
          <div className="flex flex-row items-start">
            {/* <Controller
              name="note"
              control={control}
              render={({ field, fieldState, formState }) => {
                return (
                  <Textarea
                    placeholder="Enter note or thought"
                    size="lg"
                    width="32rem"
                    onKeyDown={(e) => {
                      if (e.keyCode === 13 && e.ctrlKey) {
                        onSubmit(getValues());
                      }
                    }}
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            /> */}
            <Box width="500px" my="1rem" borderWidth="1px">
              <ContentEditable
                innerRef={noteRef}
                html={noteHtml}
                onChange={handleNoteChange}
                className="pa2"
                onKeyDown={(e) => {
                  if (e.keyCode === 13 && e.ctrlKey) {
                    onSubmit(getValues());
                  }
                }}
              />
            </Box>
            <Button
              colorScheme="blue"
              size="lg"
              type="submit"
              m="4"
              //disabled={todayPageIdLoading}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
