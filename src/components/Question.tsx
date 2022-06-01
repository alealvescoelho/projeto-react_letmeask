import { ReactNode } from 'react';
import cx from 'classnames';

import '../styles/question.scss';

/*
Adicionando classe:

MODO NORMAL (TYPESCRIPT REACT):
className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}`}

MODO CX (CLASSNAMES):
className={cx('question',{answered: isAnswered}, {highlighted: isHighlighted})}
*/

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isHighlighted?: boolean;
    isAnswered?: boolean;
    isDark?: boolean;
};

export function Question({
    content,
    author,
    children,
    isAnswered = false,
    isHighlighted = false,
    isDark = false
}: QuestionProps) {
    return (
        <div 
            className={cx('question',
                {answered: isAnswered}, 
                {highlighted: isHighlighted && !isAnswered},
                {dark: isDark}
                )}
        >
            <p>
                {content}
            </p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt="..." />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
}