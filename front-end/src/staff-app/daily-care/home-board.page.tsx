import React, { useState, useEffect, FormEvent } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Input } from "@material-ui/core"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [studentList, setStudentList] = useState(data?.students)
  useEffect(() => {
    if (!data) void getStudents()
    if (data?.students) {
      const newStudents = data.students.map((ele) => {
        return {
          ...ele,
          roll_state: "unmark",
        }
      })
      setStudentList(newStudents)
    }

    // setStudentList(data?.students)
  }, [data?.students])
  console.log("====================================")
  console.log(studentList)
  console.log("====================================")
  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort") {
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const sortStudents = (students: Person[] | undefined, keyword: string | any) => {
    const newList = JSON.parse(JSON.stringify(students))
    let res = newList?.filter((item: Person) => `${item.first_name.toLowerCase() || item.last_name.toLowerCase()}`.startsWith(keyword))

    setStudentList(res)
  }
  const searchStudents = (students: Person[] | undefined) => {
    setStudentList(students)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} studentList={data?.students} sortStudents={sortStudents} searchStudents={searchStudents} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {studentList?.map((s) => (
              <StudentListTile studentList={studentList} key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} studentList={studentList} onItemClick={onActiveRollAction} />
    </>
  )
}

// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  studentList: Person[] | undefined
  sortStudents: (value?: Person[] | undefined, val?: string | any) => void
  searchStudents: (value?: Person[] | undefined) => void
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const [nameType, setNameType] = useState("")
  const [orderType, setOrderType] = useState("")
  const [searchVal, setSearchVal] = useState("")
  const [list, setList] = useState(props.studentList)
  useEffect(() => {
    if (nameType && orderType) sortingHandler()

    setList(props.studentList)
  }, [props.studentList, nameType, orderType, searchVal])

  const sortingHandler = () => {
    const newList = JSON.parse(JSON.stringify(list))
    if (nameType === "fname" && orderType === "asc") {
      newList?.sort((a: any, b: any) => {
        if (a.first_name > b.first_name) return 1
        if (a.first_name < b.first_name) return -1
        return 0
      })
      props.sortStudents(newList, searchVal)
    }
    if (nameType === "fname" && orderType === "desc") {
      newList?.sort((a: any, b: any) => {
        if (a.first_name > b.first_name) return -1
        if (a.first_name < b.first_name) return 1
        return 0
      })
      props.sortStudents(newList, searchVal)
    }
    if (nameType === "lname" && orderType === "asc") {
      newList?.sort((a: any, b: any) => {
        if (a.last_name > b.last_name) return 1
        if (a.last_name < b.last_name) return -1
        return 0
      })
      props.sortStudents(newList, searchVal)
    }
    if (nameType === "lname" && orderType === "desc") {
      newList?.sort((a: any, b: any) => {
        if (a.last_name > b.last_name) return -1
        if (a.last_name < b.last_name) return 1
        return 0
      })
      props.sortStudents(newList, searchVal)
    }
  }

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.currentTarget.value)
    const newList = JSON.parse(JSON.stringify(list))
    let res = newList?.filter((item: Person) => `${item.first_name.toLowerCase() || item.last_name.toLowerCase()}`.startsWith(e.currentTarget.value))
    props.searchStudents(res)
  }

  const { onItemClick, studentList } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")} style={{ display: "flex", background: "green", padding: "20px" }}>
        <select
          onChange={(e) => {
            setNameType(e.target.value)
          }}
        >
          <option>Sort By</option>
          <option value="fname">First Name</option>
          <option value="lname">Last Name</option>
        </select>
        <select
          onChange={(e) => {
            setOrderType(e.target.value)
          }}
        >
          <option value="">Order By</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div>
        <S.Input placeholder="Search" value={searchVal} onChange={searchHandler}></S.Input>
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Input: styled(Input)`
    padding: ${Spacing.u2};
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    border: 1px solid white;
  `,
}
