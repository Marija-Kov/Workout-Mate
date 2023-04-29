import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import user from "@testing-library/user-event";
import Pagination from "../Pagination";
import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";

let mockWorkouts;
let total;
let limit;
let pageSpread;

beforeAll(() => {
  mockWorkouts = genSampleWorkouts();
  total = mockWorkouts.searchResults.length;
  limit = mockWorkouts.resultsOnPage.length;
  pageSpread = (() => {
    const pagesNum = Math.ceil(total / limit);
    let spread = [];
    for (let i = 1; i <= pagesNum; ++i) {
      spread.push(i);
    }
    return spread;
  })();
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  mockWorkouts = null;
  total = null;
  limit = null;
  pageSpread = null;
});

describe("<Pagination />", () => {
  it("should render Pagination component correctly given that current page is the first page and considering total number of workouts and limit of workouts per page", async () => {
    render(
      <Pagination
        page={0}
        limit={limit}
        flipPage={() => {}}
        total={total}
        pageSpread={pageSpread}
      />
    );
    const numButtons = await screen.findAllByLabelText(/go to page/i);
    const pageOne = await screen.findByLabelText(/page 1/i);
    const pageTwo = await screen.findByLabelText(/page 2/i);
    const prev = await screen.findByLabelText(/previous page/i);
    const next = await screen.findByLabelText(/next page/i);
    expect(prev).toBeInTheDocument();
    expect(prev).toHaveAttribute("disabled");
    expect(next).toBeInTheDocument();
    expect(pageOne).toHaveAttribute("class", "num--page current");
    expect(pageTwo).toHaveAttribute("class", "num--page");
    expect(numButtons.length).toBe(Math.ceil(total / limit));
  });

  it("should focus elements in the correct order given that current page is the second page i.e. 'previous' button is not disabled", async () => {
    user.setup();
    render(
      <Pagination
        page={1}
        limit={limit}
        flipPage={() => {}}
        total={total}
        pageSpread={pageSpread}
      />
    );
    const prev = await screen.findByLabelText(/previous page/i);
    const next = await screen.findByLabelText(/next page/i);
    const page1 = await screen.findByLabelText(/page 1/i);
    const page2 = await screen.findByLabelText(/page 2/i);
    const page3 = await screen.findByLabelText(/page 3/i);
    await user.tab();
    expect(prev).toHaveFocus();
    const pages = [page1, page2, page3];
    for(let i = 1; i <= 3; ++i){
      await user.tab()
      expect(pages[i-1]).toHaveFocus();   
    } 
    await user.tab()
    expect(next).toHaveFocus();   
  });

  it("should highlight corresponding page when pages are changed back and forth clicking on 'next' and 'previous' buttons", async () => {
    const PaginationWrapper = () => {
      const [page, setPage] = React.useState(0);
      const flipPage = (num) => {
        setPage((prev) => {
          if (num === -1) return prev + num;
          if (num[0]) return prev + num[0];
          return num - 1;
        });
      };
      return (
        <Pagination
          page={page}
          limit={limit}
          flipPage={flipPage}
          total={total}
          pageSpread={pageSpread}
        />
      );
    };
    user.setup();
    render(<PaginationWrapper />);
    let prev = await screen.findByLabelText(/previous page/i);
    let next = await screen.findByLabelText(/next page/i);
    let page1 = await screen.findByText(1); 
    let page2 = await screen.findByText(2); 
    let page3 = await screen.findByText(3); 
    expect(page1).toHaveAttribute("class", "num--page current");
    expect(page2).toHaveAttribute("class", "num--page");
    expect(page3).toHaveAttribute("class", "num--page");
    await user.click(next);
    page1 = await screen.findByText(1);
    page2 = await screen.findByText(2);
    page3 = await screen.findByText(3);
    expect(page1).toHaveAttribute("class", "num--page");
    expect(page2).toHaveAttribute("class", "num--page current");
    expect(page3).toHaveAttribute("class", "num--page");
    await user.click(next);
    page1 = await screen.findByText(1);
    page2 = await screen.findByText(2);
    page3 = await screen.findByText(3);
    next = await screen.findByLabelText(/next page/i);
    expect(page1).toHaveAttribute("class", "num--page");
    expect(page2).toHaveAttribute("class", "num--page");
    expect(page3).toHaveAttribute("class", "num--page current");
    expect(next).toHaveAttribute("disabled");
    await user.click(prev);
    page1 = await screen.findByText(1);
    page2 = await screen.findByText(2);
    page3 = await screen.findByText(3);
    next = await screen.findByLabelText(/next page/i);
    expect(page1).toHaveAttribute("class", "num--page");
    expect(page2).toHaveAttribute("class", "num--page current");
    expect(page3).toHaveAttribute("class", "num--page");
    expect(next).not.toHaveAttribute("disabled");
  });

  it("should highlight page number p when it is clicked", async () => {
    const PaginationWrapper = () => {
      const [page, setPage] = React.useState(0);
      const flipPage = (num) => {
        setPage((prev) => {
          if (num === -1) return prev + num;
          if (num[0]) return prev + num[0];
          return num - 1;
        });
      };
      return (
        <Pagination
          page={page}
          limit={limit}
          flipPage={flipPage}
          total={total}
          pageSpread={pageSpread}
        />
      );
    };
    user.setup();
    render(<PaginationWrapper />);
    let page1 = await screen.findByText(1);
    let page2 = await screen.findByText(2);
    let page3 = await screen.findByText(3);
    await user.click(page3);
    page1 = await screen.findByText(1);
    page2 = await screen.findByText(2);
    page3 = await screen.findByText(3);
    expect(page1).toHaveAttribute("class", "num--page");
    expect(page2).toHaveAttribute("class", "num--page");
    expect(page3).toHaveAttribute("class", "num--page current");
  });
});
